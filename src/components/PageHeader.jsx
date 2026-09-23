export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
