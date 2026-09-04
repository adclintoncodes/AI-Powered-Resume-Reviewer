export function SiteFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface-1/85 shadow-[0_-4px_16px_rgba(13,21,38,0.06)] backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-2.5 px-6 py-3">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        <p className="text-sm text-fg-muted">
          Developed by{' '}
          <a
            href="https://github.com/adclintoncodes"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-fg underline decoration-accent decoration-2 underline-offset-4 transition hover:text-accent"
          >
            Adorsoo Edem Clinton
          </a>
        </p>
      </div>
    </footer>
  )
}