"use client";

export function PreviewStyles() {
  return (
    <style>{`
      .preview-bar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;background:#1e1e1e;color:#F8F5F0;padding:.6rem 1.5rem;font-size:.8rem;box-shadow:0 2px 12px rgba(0,0,0,.2)}
      .preview-bar__left{display:flex;align-items:center;gap:.65rem}
      .preview-bar__dot{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px rgba(74,222,128,.5)}
      .preview-bar__label{font-weight:700;letter-spacing:.02em}
      .preview-bar__tag{background:rgba(194,143,80,.2);color:#C28F50;font-size:.65rem;font-weight:600;padding:.2rem .6rem;border-radius:9999px;text-transform:uppercase;letter-spacing:.06em}
      .preview-bar__link{display:inline-flex;align-items:center;gap:.3rem;color:#C28F50;text-decoration:none;font-weight:600;font-size:.75rem;padding:.35rem .8rem;border-radius:.375rem;border:1px solid rgba(194,143,80,.3);transition:background .15s}
      .preview-bar__link:hover{background:rgba(194,143,80,.12)}
      .preview-main{min-height:100vh;background:#FFFFFF}
      .preview-footer{text-align:center;padding:3rem 1rem;background:#2B2B2B;color:rgba(248,245,240,.5);font-size:.75rem}
      .preview-footer span{color:#C28F50}
      .preview-loading{text-align:center;padding:4rem;color:#888;font-size:.9rem}
      .preview-error{text-align:center;padding:4rem 2rem;color:#666}
      .preview-error h2{font-size:1.5rem;font-weight:700;margin-bottom:.5rem;color:#2B2B2B}
      .preview-error p{color:#888}
    `}</style>
  );
}

export function PreviewBar({ title }: { title: string }) {
  return (
    <div className="preview-bar">
      <div className="preview-bar__left">
        <span className="preview-bar__dot" />
        <span className="preview-bar__label">{title}</span>
        <span className="preview-bar__tag">Puck Render</span>
      </div>
      <a href="/admin/editor" className="preview-bar__link">
        ← Back to Editor
      </a>
    </div>
  );
}

export function PreviewFooter() {
  return (
    <footer className="preview-footer">
      Built with <span>Puck</span> Visual Page Builder &middot; BaanMae Property
    </footer>
  );
}
