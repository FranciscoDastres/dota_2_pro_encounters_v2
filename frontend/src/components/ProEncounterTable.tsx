import type { ProEncountersResponse } from '../types'
import { ProEncounterRow } from './ProEncounterRow'

interface Props {
  data: ProEncountersResponse
}

const HEADERS = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'player', label: 'Jugador' },
  { key: 'team', label: 'Equipo' },
  { key: 'last_match', label: 'Último partido' },
  { key: 'games', label: 'Partidas' },
  { key: 'wins', label: 'Victorias' },
  { key: 'winrate', label: 'Win%' },
  { key: 'country', label: 'País' },
] as const

export function ProEncounterTable({ data }: Props) {
  const count = data.pros.length

  return (
    <div>
      <p className="mb-4 text-gray-400">
        Se encontraron{' '}
        <span className="text-dota-gold font-semibold">{count}</span>{' '}
        {count === 1 ? 'pro' : 'pros'} para la cuenta{' '}
        <span className="font-mono text-white">#{data.account_id}</span>
      </p>

      <div className="overflow-x-auto rounded-lg border border-dota-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dota-border bg-dota-surface">
              {HEADERS.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-4 py-3 text-left text-gray-400 font-medium uppercase tracking-wide text-xs whitespace-nowrap"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.pros.map((pro) => (
              <ProEncounterRow key={pro.account_id} pro={pro} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
