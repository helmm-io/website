/* HELM MSP — <image-slot> custom element (image-slot.js)
   A drag-drop image placeholder for design/prototype use.
   Drag in an image file → it encodes to WebP (or falls back to original)
   and swaps the placeholder. Persists slots via window.omelette.writeFile
   when running inside Claude Design; no-ops otherwise.

   Usage: <image-slot id="unique-id" width="600" height="400" label="Photo here"></image-slot>
*/
(function () {
  if (customElements.get('image-slot')) return;

  const CSS = `
    :host { display: block; position: relative; cursor: pointer; overflow: hidden; }
    .is { width: 100%; height: 100%; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: #e6ecef; border: 2px dashed #aabbc0; font-family: 'Work Sans', sans-serif; color: #7c8688; font-size: 13px; gap: 8px; box-sizing: border-box; }
    .is.drag { border-color: #1a8fa0; background: rgba(26,143,160,0.08); }
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; opacity: 0.7; }
    .icon { font-size: 22px; opacity: 0.5; }
  `;

  class ImageSlot extends HTMLElement {
    constructor() {
      super();
      this._sr = this.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = CSS;
      this._sr.appendChild(style);
      this._el = null;
    }

    connectedCallback() {
      const w = this.getAttribute('width');
      const h = this.getAttribute('height');
      if (w) this.style.width = w + 'px';
      if (h) this.style.height = h + 'px';

      const div = document.createElement('div');
      div.className = 'is';
      div.innerHTML = '<span class="icon">📷</span><span class="label">' + (this.getAttribute('label') || 'Drop image here') + '</span>';
      this._sr.appendChild(div);
      this._el = div;

      div.addEventListener('dragover', e => { e.preventDefault(); div.classList.add('drag'); });
      div.addEventListener('dragleave', () => div.classList.remove('drag'));
      div.addEventListener('drop', e => { e.preventDefault(); div.classList.remove('drag'); const f = e.dataTransfer.files[0]; if (f) this._load(f); });
      div.addEventListener('click', () => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.onchange = () => inp.files[0] && this._load(inp.files[0]); inp.click(); });

      this._tryRestore();
    }

    async _load(file) {
      try {
        let url;
        try {
          const bmp = await createImageBitmap(file);
          const canvas = document.createElement('canvas');
          canvas.width = bmp.width; canvas.height = bmp.height;
          canvas.getContext('2d').drawImage(bmp, 0, 0);
          url = canvas.toDataURL('image/webp', 0.88);
        } catch {
          url = URL.createObjectURL(file);
        }
        this._show(url);
        this._persist(url);
      } catch (e) {
        console.warn('image-slot load error:', e);
      }
    }

    _show(url) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = this.getAttribute('label') || '';
      while (this._sr.lastChild !== this._sr.firstChild) this._sr.removeChild(this._sr.lastChild);
      this._sr.appendChild(img);
    }

    _persist(url) {
      const id = this.id || this.getAttribute('id');
      if (!id) return;
      const key = '.image-slots.state.json';
      try {
        let state = {};
        try { state = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
        state[id] = url;
        localStorage.setItem(key, JSON.stringify(state));
      } catch {}
      if (window.omelette && window.omelette.writeFile) {
        try {
          let state = {};
          try { state = JSON.parse(window.omelette.readFile(key) || '{}'); } catch {}
          state[id] = url;
          window.omelette.writeFile(key, JSON.stringify(state));
        } catch {}
      }
    }

    _tryRestore() {
      const id = this.id || this.getAttribute('id');
      if (!id) return;
      const key = '.image-slots.state.json';
      let url = null;
      if (window.omelette && window.omelette.readFile) {
        try { const s = JSON.parse(window.omelette.readFile(key) || '{}'); url = s[id] || null; } catch {}
      }
      if (!url) {
        try { const s = JSON.parse(localStorage.getItem(key) || '{}'); url = s[id] || null; } catch {}
      }
      if (url) this._show(url);
    }
  }

  customElements.define('image-slot', ImageSlot);
})();
