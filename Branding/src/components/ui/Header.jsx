export function Header({ subtitle, rightLabel, rightDate, rightAuthor }) {
  return (
    <header className="flex justify-between items-start px-10 py-5 border-b border-fm-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-heading text-[22pt] italic text-fm-primary leading-none">FM</span>
          <div className="w-px h-6 bg-fm-border" />
          <span className="font-heading text-[14pt] text-white leading-none">Frecuencia Mágica</span>
        </div>
        {subtitle && <p className="text-[9px] tracking-[0.25em] text-white/40 font-body hidden lg:block">{subtitle}</p>}
      </div>
      {(rightLabel || rightDate || rightAuthor) && (
        <div className="text-right">
          {rightLabel  && <p className="text-[9px] tracking-widest text-white/35 font-body">{rightLabel}</p>}
          {rightDate   && <p className="text-[9px] tracking-widest text-white/35 font-body">{rightDate}</p>}
          {rightAuthor && <p className="text-[9px] font-medium text-white/55 font-body">{rightAuthor}</p>}
        </div>
      )}
    </header>
  );
}

export default Header;
