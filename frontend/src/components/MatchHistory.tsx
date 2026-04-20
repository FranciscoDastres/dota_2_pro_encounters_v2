import { useEffect } from 'react'
import { useSharedMatches } from '../hooks/useSharedMatches'
import type { SharedMatch } from '../types'

interface Props {
  accountId: number
  proAccountId: number
}

function isWin(match: SharedMatch): boolean {
  const isRadiant = match.player_slot < 128
  return isRadiant ? match.radiant_win : !match.radiant_win
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatMatchDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function MatchHistory({ accountId, proAccountId }: Props) {
  const { data, status, error, load } = useSharedMatches(accountId, proAccountId)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-dota-border border-t-dota-gold" />
        Loading matches…
      </div>
    )
  }

  if (status === 'error') {
    return (
      <p className="py-3 text-center text-sm text-dota-red/80">{error}</p>
    )
  }

  if (!data || data.length === 0) {
    return (
      <p className="py-3 text-center text-sm text-gray-600">
        No match details available for this player.
      </p>
    )
  }

  return (
    <div>
      <p className="mb-2 text-xs text-gray-600">
        {data.length} shared {data.length === 1 ? 'match' : 'matches'} — click any to open in OpenDota
      </p>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((match) => {
          const won = isWin(match)
          return (
            <a
              key={match.match_id}
              href={`https://www.opendota.com/matches/${match.match_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                'flex items-center justify-between rounded-lg border px-3 py-2 text-xs',
                'transition-all duration-150 hover:scale-[1.01]',
                won
                  ? 'border-dota-radiant/25 bg-dota-radiant/5 hover:border-dota-radiant/50 hover:bg-dota-radiant/10'
                  : 'border-dota-dire/25 bg-dota-dire/5 hover:border-dota-dire/50 hover:bg-dota-dire/10',
              ].join(' ')}
            >
              {/* Left: ID + date */}
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[11px] text-gray-400">
                  #{match.match_id}
                </span>
                <span className="text-[10px] text-gray-600">
                  {formatMatchDate(match.start_time)}
                </span>
              </div>

              {/* Right: result + stats */}
              <div className="flex flex-col items-end gap-0.5">
                <span
                  className={`text-[11px] font-bold ${
                    won ? 'text-dota-radiant' : 'text-dota-dire'
                  }`}
                >
                  {won ? 'WIN' : 'LOSS'}
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                  {match.kills}/{match.deaths}/{match.assists}
                  {' · '}
                  {formatDuration(match.duration)}
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
