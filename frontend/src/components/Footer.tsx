export function Footer() {
  return (
    <footer className="mt-auto border-t border-dota-border px-4 py-8 text-center">
      {/* Buy Me a Coffee — placeholder (Phase 6) */}
      <div className="mb-5 flex justify-center">
        <a
          href="#"
          aria-label="Buy Me a Coffee"
          className="inline-flex items-center gap-2 rounded-full border border-dota-border bg-dota-surface px-5 py-2.5 text-sm text-gray-400 transition-all hover:border-dota-gold/40 hover:text-dota-gold"
        >
          ☕ <span>Buy me a coffee</span>
        </a>
      </div>

      <p className="text-xs text-gray-700">
        Powered by{' '}
        <a
          href="https://www.opendota.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-gray-500"
        >
          OpenDota API
        </a>
        {' · '}
        No afiliado con Valve Corporation
      </p>
      <p className="mt-1 text-xs text-gray-800">
        © {new Date().getFullYear()} Dota 2 Pro Encounters
      </p>
    </footer>
  )
}
