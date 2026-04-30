import { usePlayerProfile } from '../hooks/usePlayerProfile'
import type { TopHero } from '../hooks/usePlayerProfile'
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

function HeroIcon({ heroId, heroMap, size = 8 }: { heroId: number | null; heroMap: ReturnType<typeof useHeroes>; size?: number }) {
  const hero = heroId ? heroMap[heroId] : null
  const cls = `h-${size} w-${size} flex-shrink-0 rounded`
  return hero ? (
    <img
      src={heroIconUrl(hero)}
      alt={hero.localized_name}
      className={cls + ' ring-1 ring-dota-border'}
      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
    />
  ) : (
    <div className={cls + ' bg-dota-border/40'} />
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
  const lastMatchHero = lastMatch ? heroMap[lastMatch.hero_id] : null

  return (
    <div className="mb-6 rounded-xl border border-dota-border bg-dota-surface">

      {/* Top: avatar + identity */}
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

      <div className="h-px bg-dota-border/60" />

      {/* Bottom: top heroes + last match */}
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">

        {/* Top 3 heroes by win rate */}
        <div className="px-5 py-4">
          <p className="mb-3 text-[10px] uppercase tracking-wider text-gray-600">Most Played</p>
          {data.topHeroes.length === 0 ? (
            <p className="text-xs text-gray-700">Not enough data (min. 10 games per hero)</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {data.topHeroes.map((th: TopHero, i) => {
                const hero = heroMap[th.heroId]
                return (
                  <div key={th.heroId} className="flex items-center gap-3">
                    <span className="w-4 text-[11px] font-mono text-gray-700 flex-shrink-0">{i + 1}</span>
                    <HeroIcon heroId={th.heroId} heroMap={heroMap} size={8} />
                    <span className="flex-1 truncate text-sm text-white">{hero?.localized_name ?? '—'}</span>
                    <span className="text-xs font-mono text-dota-radiant">{Math.round(th.winRate * 100)}%</span>
                    <span className="text-[11px] text-gray-600">{th.games}g</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Divider vertical on sm+ */}
        <div className="hidden sm:block absolute" />

        {/* Last match */}
        <div className="border-t border-dota-border/60 px-5 py-4 sm:border-t-0 sm:border-l">
          <p className="mb-3 text-[10px] uppercase tracking-wider text-gray-600">Last Match</p>
          {lastMatch ? (
            <a
              href={`https://www.opendota.com/matches/${lastMatch.match_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all hover:scale-[1.01]',
                lastMatchWon
                  ? 'border-dota-radiant/25 bg-dota-radiant/5 hover:border-dota-radiant/50'
                  : 'border-dota-dire/25 bg-dota-dire/5 hover:border-dota-dire/50',
              ].join(' ')}
            >
              <HeroIcon heroId={lastMatch.hero_id} heroMap={heroMap} size={10} />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  {lastMatchHero?.localized_name ?? '—'}
                </span>
                <span className="font-mono text-[11px] text-gray-500">
                  #{lastMatch.match_id}
                </span>
                <span className="text-[11px] text-gray-600">{timeAgo(lastMatch.start_time)}</span>
              </div>
              <span className={`text-sm font-bold flex-shrink-0 ${lastMatchWon ? 'text-dota-radiant' : 'text-dota-dire'}`}>
                {lastMatchWon ? 'WIN' : 'LOSS'}
              </span>
            </a>
          ) : (
            <p className="text-xs text-gray-700">No recent matches found</p>
          )}
        </div>

      </div>
    </div>
  )
}
