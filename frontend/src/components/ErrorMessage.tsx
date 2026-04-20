interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="text-red-400 text-lg">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg border border-dota-border text-gray-300 hover:text-white hover:border-gray-400 transition-colors text-sm cursor-pointer"
        >
          Intentar de nuevo
        </button>
      )}
    </div>
  )
}
