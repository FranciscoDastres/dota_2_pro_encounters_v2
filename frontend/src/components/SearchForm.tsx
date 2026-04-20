import { useState, type FormEvent } from 'react'

interface SearchFormProps {
  onSearch: (accountId: string) => void
  loading: boolean
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [value, setValue] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = value.trim()

    if (!trimmed) {
      setValidationError('Ingresa tu Account ID')
      return
    }
    if (!/^\d+$/.test(trimmed)) {
      setValidationError('El Account ID debe contener solo números')
      return
    }

    setValidationError('')
    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="account-id" className="sr-only">
            Account ID de Dota 2
          </label>
          <input
            id="account-id"
            type="text"
            inputMode="numeric"
            placeholder="Account ID (ej: 123456789)"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (validationError) setValidationError('')
            }}
            disabled={loading}
            aria-describedby={validationError ? 'account-id-error' : undefined}
            aria-invalid={Boolean(validationError)}
            className="w-full px-4 py-2.5 rounded-lg bg-dota-surface border border-dota-border text-white placeholder-gray-500 focus:outline-none focus:border-dota-gold disabled:opacity-50 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-dota-red hover:bg-dota-red-dark text-white font-semibold disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      {validationError && (
        <p id="account-id-error" role="alert" className="mt-2 text-sm text-red-400">
          {validationError}
        </p>
      )}
    </form>
  )
}
