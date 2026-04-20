export function LoadingSpinner() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      role="status"
      aria-label="Cargando resultados"
    >
      <div className="w-10 h-10 border-4 border-dota-border border-t-dota-gold rounded-full animate-spin" />
      <p className="text-gray-400">Consultando OpenDota...</p>
    </div>
  )
}
