import { useState, useMemo } from 'react'
import type { ProEncountersResponse, ProEncounter } from '../types'
import { ProEncounterRow } from './ProEncounterRow'

interface Props {
  data: ProEncountersResponse
}

type SortKey = 'personaname' | 'team_name' | 'last_match_time' | 'games' | 'win' | 'losses' | 'winrate'
type SortDir = 'asc' | 'desc'

interface Header {
  key: string
  label: string
  sortKey: SortKey | null
  align?: 'left' | 'center'
}

const HEADERS: Header[] = [
  { key: 'avatar',     label: 'Avatar',      sortKey: null },
  { key: 'player',     label: 'Player',      sortKey: 'personaname' },
  { key: 'team',       label: 'Team',        sortKey: 'team_name' },
  { key: 'last_match', label: 'Last Match',  sortKey: 'last_match_time' },
  { key: 'games',      label: 'Games',       sortKey: 'games',           align: 'center' },
  { key: 'wins',       label: 'W',           sortKey: 'win',             align: 'center' },
  { key: 'losses',     label: 'L',           sortKey: 'losses',          align: 'center' },
  { key: 'winrate',    label: 'Win%',        sortKey: 'winrate',         align: 'center' },
  { key: 'country',    label: 'Country',     sortKey: null,              align: 'center' },
  { key: 'expand',     label: '',            sortKey: null },
]

function sortPros(pros: ProEncounter[], key: SortKey, dir: SortDir): ProEncounter[] {
  return [...pros].sort((a, b) => {
    let valA: number | string
    let valB: number | string

    switch (key) {
      case 'losses':
        valA = a.games - a.win
        valB = b.games - b.win
        break
      case 'winrate':
        valA = a.games > 0 ? a.win / a.games : -1
        valB = b.games > 0 ? b.win / b.games : -1
        break
      case 'last_match_time':
        valA = a.last_match_time ? new Date(a.last_match_time).getTime() : 0
        valB = b.last_match_time ? new Date(b.last_match_time).getTime() : 0
        break
      default:
        valA = (a[key] as number | string) ?? ''
        valB = (b[key] as number | string) ?? ''
    }

    if (valA < valB) return dir === 'asc' ? -1 : 1
    if (valA > valB) return dir === 'asc' ? 1 : -1
    return 0
  })
}

export function ProEncounterTable({ data }: Props) {
  const total = data.pros.length
  const [sortKey, setSortKey] = useState<SortKey>('games')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [onlyNamed, setOnlyNamed] = useState(true)

  const filtered = useMemo(
    () => onlyNamed ? data.pros.filter(p => p.name) : data.pros,
    [data.pros, onlyNamed],
  )

  const sorted = useMemo(
    () => sortPros(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir],
  )

  const count = sorted.length

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <div>
      {/* Summary bar */}
      <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
        <p data-testid="summary-bar" className="text-gray-400">
          <span className="text-2xl font-bold text-dota-gold">{count}</span>
          {onlyNamed && count < total && (
            <span className="ml-1 text-sm text-gray-600">of {total}</span>
          )}
          {' '}
          <span className="text-sm">
            {count === 1 ? 'pro found' : 'pros found'} for account{' '}
            <span className="font-mono text-white">#{data.account_id}</span>
          </span>
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOnlyNamed(v => !v)}
            className={[
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all cursor-pointer',
              onlyNamed
                ? 'border-dota-gold/50 bg-dota-gold/10 text-dota-gold'
                : 'border-dota-border text-gray-500 hover:border-dota-gold/30 hover:text-gray-400',
            ].join(' ')}
          >
            <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${onlyNamed ? 'bg-dota-gold' : 'bg-gray-600'}`} />
            Named pros only
          </button>

          <span className="hidden rounded-full border border-dota-border px-3 py-1 text-xs text-gray-600 sm:block">
            Data by OpenDota
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-dota-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dota-border bg-dota-surface">
              {HEADERS.map(({ key, label, sortKey: sk, align }) => (
                <th
                  key={key}
                  scope="col"
                  className={[
                    'px-4 py-3 text-xs font-medium uppercase tracking-widest text-gray-500 whitespace-nowrap',
                    align === 'center' ? 'text-center' : 'text-left',
                    sk ? 'cursor-pointer select-none hover:text-gray-300 transition-colors' : '',
                  ].join(' ')}
                  onClick={sk ? () => handleSort(sk) : undefined}
                >
                  {label}
                  {sk && (
                    <span className="ml-1 inline-block w-3">
                      {sortKey === sk
                        ? sortDir === 'asc'
                          ? '↑'
                          : '↓'
                        : <span className="text-gray-700">↕</span>}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((pro, index) => (
              <ProEncounterRow
                key={pro.account_id}
                pro={pro}
                index={index}
                accountId={data.account_id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
