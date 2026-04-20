import { useProEncounters } from './hooks/useProEncounters'
import { SearchForm } from './components/SearchForm'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorMessage } from './components/ErrorMessage'
import { EmptyState } from './components/EmptyState'
import { ProEncounterTable } from './components/ProEncounterTable'

function App() {
  const { data, status, error, search, reset } = useProEncounters()

  return (
    <div className="min-h-screen bg-dota-dark text-white">
      <header className="py-12 text-center px-4">
        <h1 className="text-4xl font-bold text-dota-gold mb-3">
          Dota 2 Pro Encounters
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Ingresa tu Account ID y descubre si alguna vez jugaste con o contra jugadores profesionales.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <section className="flex justify-center mb-10">
          <SearchForm onSearch={search} loading={status === 'loading'} />
        </section>

        {status === 'loading' && <LoadingSpinner />}

        {status === 'error' && error && (
          <ErrorMessage message={error} onRetry={reset} />
        )}

        {status === 'success' && data && data.pros.length === 0 && (
          <EmptyState accountId={data.account_id} />
        )}

        {status === 'success' && data && data.pros.length > 0 && (
          <ProEncounterTable data={data} />
        )}
      </main>
    </div>
  )
}

export default App
