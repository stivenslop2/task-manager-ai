const links = [
  { label: 'Portfolio', href: 'https://julianlopez.dev' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/stiven-julian-lopez/',
  },
  { label: 'GitHub', href: 'https://github.com/stivenslop2' },
  { label: 'Email', href: 'mailto:stivenslop@hotmail.com' },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm font-semibold text-ink">
          Built by Julian Lopez — AI Engineer
        </p>
        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
          {links.map((l, i) => (
            <li key={l.href} className="flex items-center gap-4">
              <a
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                className="font-medium transition-colors hover:text-brand-700"
              >
                {l.label}
              </a>
              {i < links.length - 1 ? (
                <span aria-hidden className="text-ink-soft">
                  ·
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
