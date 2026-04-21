export function OfflineBanner() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-dota-red/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
    >
      <span aria-hidden="true">⚡</span>
      No internet connection — data may be unavailable
    </div>
  )
}
