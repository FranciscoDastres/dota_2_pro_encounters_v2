interface EmptyStateProps {
  accountId: number
}

export function EmptyState({ accountId }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-xl text-gray-300">
        No se encontraron partidas contra pros para la cuenta{' '}
        <span className="text-dota-gold font-mono">#{accountId}</span>
      </p>
      <p className="text-gray-500 text-sm">
        Esto puede deberse a que el perfil es privado o no tiene partidas públicas registradas.
      </p>
    </div>
  )
}
