# HELM Website — Where It's Hosted & How to Reboot

Quick-reference for when the site is down or misbehaving. For architecture/dev details, see [README.md](README.md).

## Where everything lives

| Layer | What | Where |
|---|---|---|
| DNS + SSL termination (edge) | Cloudflare | Proxies `helmm.io` and `www` to the AWS load balancer. SSL mode: Full (strict). |
| Load balancer | `helm-web-alb` | AWS eu-west-2, account `669031107739`. Terminates HTTPS with an ACM cert, forwards to the web server. |
| Web server | EC2 instance `i-0913c45eb892e511f` (name: `helm-web-1`) | t3.micro, eu-west-2a. Runs nginx (static site) + the HubSpot proxy service. No SSH key — managed via AWS SSM. |
| Site source | GitHub repo `helmm-io/website` | Pushing to `main` auto-deploys to the instance via GitHub Actions. |
| Secrets | AWS SSM Parameter Store | HubSpot token at `/helm/hubspot/pat` (encrypted, never in the repo). |

**Region for all AWS commands below: `eu-west-2`.**

## "The site is down" — checklist

Run these in order; each one narrows down where the problem is.

**1. Is it DNS/Cloudflare or AWS?**

```bash
curl -sI https://helmm.io/                                                    # via Cloudflare
curl -sI http://helm-web-alb-344857113.eu-west-2.elb.amazonaws.com/           # direct to AWS, bypassing Cloudflare
```
If the direct-to-AWS check works but `helmm.io` doesn't, the problem is Cloudflare-side (check Cloudflare status / DNS records / SSL mode) — AWS is fine, skip to nothing, contact Cloudflare support instead.

**2. Is the instance running?**

```bash
aws ec2 describe-instances --instance-ids i-0913c45eb892e511f \
  --query 'Reservations[0].Instances[0].[State.Name,StateTransitionReason]' --output text
```

- If it says `stopped` → **someone or something stopped it.** Start it:
  ```bash
  aws ec2 start-instances --instance-ids i-0913c45eb892e511f
  ```
  Everything (site files, nginx config, HubSpot proxy) is on the instance's disk and comes back automatically — no rebuild needed. Takes 1–2 minutes to boot and pass load balancer health checks.

- If it says `running` but the site still doesn't load → go to step 3.

**3. Is the load balancer seeing it as healthy?**

```bash
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:eu-west-2:669031107739:targetgroup/helm-web-tg/033c186bb52390ba \
  --query 'TargetHealthDescriptions[].[Target.Id,TargetHealth.State,TargetHealth.Reason]' --output text
```

If unhealthy and the instance is running, nginx or the instance's network may be stuck — try a reboot (step 4).

**4. Reboot the web server** (safe, ~1 minute of downtime, nothing is lost):

```bash
aws ec2 reboot-instances --instance-ids i-0913c45eb892e511f
```

nginx and the HubSpot proxy both auto-start on boot.

**5. Restart just the HubSpot proxy** (if quote/contact forms aren't reaching HubSpot, but the rest of the site is fine) — no reboot needed, and no SSH key required since this runs via SSM:

```bash
aws ssm send-command --instance-ids i-0913c45eb892e511f \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["systemctl restart helm-hubspot-proxy","systemctl is-active helm-hubspot-proxy"]'
```

**6. Nothing above works / instance itself seems broken** — redeploy from scratch by re-running the GitHub Actions workflow (Actions tab → Deploy to AWS → Run workflow), or push any small commit to `main` to trigger it.

## Who can stop/start things

Anyone with AWS console/CLI access to account `669031107739` can stop the instance — it isn't only triggered by crashes or cost limits. If the site goes down unexpectedly, check who did it before assuming a fault:

```bash
aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=StopInstances \
  --max-results 5 --query 'Events[].[EventTime,Username]' --output text
```

(CloudTrail can lag ~15 minutes before an event shows up.)

## Costs

Every resource is tagged `HELM=website`. Check spend: AWS Console → Billing → Cost Explorer, filtered by that tag (tag must be "activated" once under Billing → Cost allocation tags — see [README.md](README.md) if that hasn't been done). Also check Billing → Free Tier usage if the instance keeps getting stopped unexpectedly — that can be a sign of credit exhaustion.
