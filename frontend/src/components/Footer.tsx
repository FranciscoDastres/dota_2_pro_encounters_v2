const kofiUsername = import.meta.env.VITE_KOFI_USERNAME as string | undefined

export function Footer() {
  return (
    <footer className="mt-auto border-t border-dota-border px-4 py-8 text-center">
      {/* Ko-fi button */}
      {kofiUsername && (
        <div className="mb-5 flex justify-center">
          <a
            href={`https://ko-fi.com/${kofiUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Apóyame en Ko-fi"
            className="inline-flex items-center gap-2 rounded-full border border-[#29ABE0]/30 bg-dota-surface px-5 py-2.5 text-sm text-gray-400 transition-all hover:border-[#29ABE0] hover:bg-[#29ABE0]/10 hover:text-[#29ABE0]"
          >
            {/* Ko-fi cup icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7V5c0-.55-.45-1-1-1zm-1 7c0 2.76-2.24 5-5 5s-5-2.24-5-5V6h10v4zM4 19h16v2H4z" />
            </svg>
            <span>Support me on Ko-fi</span>
          </a>
        </div>
      )}

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
      </p>
      <p className="mt-1 text-xs text-gray-800">
        © {new Date().getFullYear()} StompTracker
      </p>
    </footer>
  )
}
