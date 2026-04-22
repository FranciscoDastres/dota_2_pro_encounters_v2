import { useProEncounters } from './hooks/useProEncounters'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { SearchForm } from './components/SearchForm'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorMessage } from './components/ErrorMessage'
import { EmptyState } from './components/EmptyState'
import { ProEncounterTable } from './components/ProEncounterTable'
import { Footer } from './components/Footer'
import { KofiWidget } from './components/KofiWidget'
import { OfflineBanner } from './components/OfflineBanner'
import { HeroBackground } from './components/HeroBackground'

function App() {
  const { data, status, error, search, reset } = useProEncounters()
  const isOnline = useOnlineStatus()

  return (
    <div className="min-h-screen bg-dota-dark text-white flex flex-col">
      {!isOnline && <OfflineBanner />}

      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden py-20 px-4 text-center">
        {/* Hero lineup background */}
        <HeroBackground />

        {/* Background glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-dota-gold/8 blur-[100px] animate-glow" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-dota-border to-transparent" />

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-dota-gold/70">
            OpenDota API
          </p>

          <h1 className="mb-5 text-5xl font-bold leading-tight md:text-6xl">
            <span className="bg-gradient-to-r from-dota-gold to-dota-gold-light bg-clip-text text-transparent">
              Stomp
            </span>
            <span className="text-white">Tracker</span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-lg text-gray-400">
            Enter your{' '}
            <strong className="font-semibold text-white">Account ID</strong> and discover
            if you ever shared a match with professional Dota 2 players.
          </p>

          <div className="flex justify-center">
            <SearchForm onSearch={search} loading={status === 'loading'} />
          </div>

          <p className="mt-4 text-xs text-gray-600">
            Don't know your Account ID? Find yourself on{' '}
            <a
              href="https://www.opendota.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 underline-offset-2 hover:text-dota-gold hover:underline transition-colors"
            >
              opendota.com
            </a>
            — it appears in your profile URL.
          </p>
        </div>
      </header>

      {/* ── Results ──────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12">
        {status === 'loading' && <LoadingSpinner />}

        {status === 'error' && error && (
          <ErrorMessage message={error} onRetry={reset} />
        )}

        {status === 'success' && data && data.pros.length === 0 && (
          <EmptyState accountId={data.account_id} />
        )}

        {status === 'success' && data && data.pros.length > 0 && (
          <div className="animate-fade-up">
            <ProEncounterTable data={data} />
          </div>
        )}
      </main>

      <Footer />
      <KofiWidget />
    </div>
  )
}

export default App
