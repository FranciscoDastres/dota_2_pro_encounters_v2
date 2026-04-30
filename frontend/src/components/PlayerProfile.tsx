import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { useHeroes, heroIconUrl } from '../hooks/useHeroes'
import { countryCodeToFlag } from '../utils/formatters'

interface Props {
  accountId: number
}

const RANK_NAMES = ['', 'Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal']
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V']

function rankLabel(tier: number | null): string | null {
  if (!tier) return null
  const medal = Math.floor(tier / 10)
  const stars = tier % 10
  const name = RANK_NAMES[medal]
  if (!name) return null
  if (medal === 8) return 'Immortal'
  return stars ? `${name} ${ROMAN[stars] ?? ''}` : name
}

function timeAgo(unixSeconds: number): string {
  const diff = Math.floor((Date.now() / 1000) - unixSeconds)
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  const days = Math.floor(diff / 86400)
  return days === 1 ? '1 day ago' : `${days} days ago`
}

function isWin(slot: number, radiantWin: boolean): boolean {
  return slot < 128 ? radiantWin : !radiantWin
}

interface HeroTileProps {
  label: string
  heroId: number | null
  heroMap: ReturnType<typeof useHeroes>
  sub1: string
  sub2: string
  win?: boolean
}

function HeroTile({ label, heroId, heroMap, sub1, sub2, win }: HeroTileProps) {
  const hero = heroId ? heroMap[heroId] : null
  return (
    <div className="flex items-center gap-3">
      {hero ? (
        <img
          src={heroIconUrl(hero)}
          alt={hero.localized_name}
          className="h-10 w-10 flex-shrink-0 rounded-lg ring-1 ring-dota-border"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-dota-border/40" />
      )}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-600">{label}</p>
        <p className="truncate text-sm font-semibold text-white">{hero?.localized_name ?? '—'}</p>
        <p className="text-[11px] text-gray-500">{sub1}</p>
        {sub2 && (
          <p className={`text-[11px] font-mono font-bold ${win === true ? 'text-dota-radiant' : win === false ? 'text-dota-dire' : 'text-gray-400'}`}>
            {sub2}
          </p>
        )}
      </div>
    </div>
  )
}

export function PlayerProfile({ accountId }: Props) {
  const { data, loading } = usePlayerProfile(accountId)
  const heroMap = useHeroes()

  if (loading) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-dota-border bg-dota-surface px-5 py-4">
        <div className="h-14 w-14 flex-shrink-0 animate-pulse rounded-full bg-dota-border/40" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-36 animate-pulse rounded bg-dota-border/40" />
          <div className="h-3 w-24 animate-pulse rounded bg-dota-border/30" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const rank = rankLabel(data.rankTier)
  const overallWR = data.totalGames > 0
    ? Math.round((data.totalWins / data.totalGames) * 100)
    : null

  const lastMatch = data.lastMatch
  const lastMatchWon = lastMatch ? isWin(lastMatch.player_slot, lastMatch.radiant_win) : undefined

  return (
    <div className="mb-6 rounded-xl border border-dota-border bg-dota-surface">
      {/* Top row: avatar + identity + global stats */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-4">
        <a href={data.profileurl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
          <img
            src={data.avatarfull}
            alt={data.personaname}
            className="h-14 w-14 rounded-full ring-2 ring-dota-border transition-all hover:ring-dota-gold/50"
          />
        </a>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={data.profileurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-white hover:text-dota-gold-light transition-colors truncate"
            >
              {data.personaname}
            </a>
            {data.countryCode && (
              <span className="text-base" title={data.countryCode}>
                {countryCodeToFlag(data.countryCode)}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-3">
            {rank && (
              <span className="rounded-full border border-dota-gold/30 bg-dota-gold/10 px-2 py-0.5 text-[11px] font-medium text-dota-gold">
                {rank}
              </span>
            )}
            {overallWR !== null && (
              <span className="text-xs text-gray-500">
                <span className="font-mono text-white">{overallWR}%</span>
                {' WR · '}
                <span className="font-mono text-white">{data.totalGames.toLocaleString()}</span>
                {' games'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-dota-border/60" />

      {/* Bottom row: 3 hero tiles */}
      <div className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-3">
        <HeroTile
          label="Most Played"
          heroId={data.mostPlayedHeroId}
          heroMap={heroMap}
          sub1={`${data.mostPlayedHeroGames} games`}
          sub2={`${Math.round(data.mostPlayedHeroWinRate * 100)}% WR`}
        />

        <HeroTile
          label="Best Win Rate"
          heroId={data.bestHeroId}
          heroMap={heroMap}
          sub1={`${data.bestHeroGames} games`}
          sub2={`${Math.round(data.bestHeroWinRate * 100)}% WR`}
        />

        {lastMatch ? (
          <HeroTile
            label="Last Match"
            heroId={lastMatch.hero_id}
            heroMap={heroMap}
            sub1={timeAgo(lastMatch.start_time)}
            sub2={lastMatchWon ? 'WIN' : 'LOSS'}
            win={lastMatchWon}
          />
        ) : (
          <HeroTile
            label="Last Match"
            heroId={null}
            heroMap={heroMap}
            sub1="—"
            sub2=""
          />
        )}
      </div>
    </div>
  )
}
