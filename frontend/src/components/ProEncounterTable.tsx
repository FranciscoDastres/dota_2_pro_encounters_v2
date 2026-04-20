import type { ProEncountersResponse } from '../types'
import { ProEncounterRow } from './ProEncounterRow'

interface Props {
  data: ProEncountersResponse
}

const HEADERS = [
  { key: 'avatar',      label: 'Avatar' },
  { key: 'player',      label: 'Jugador' },
  { key: 'team',        label: 'Equipo' },
  { key: 'last_match',  label: 'Último partido' },
  { key: 'games',       label: 'Partidas' },
  { key: 'wins',        label: 'Victorias' },
  { key: 'winrate',     label: 'Win%' },
  { key: 'country',     label: 'País' },
] as const

export function ProEncounterTable({ data }: Props) {
  const count = data.pros.length

  return (
    <div>
      {/* Summary bar */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <p data-testid="summary-bar" className="text-gray-400">
          <span className="text-2xl font-bold text-dota-gold">{count}</span>{' '}
          <span className="text-sm">
            {count === 1 ? 'pro encontrado' : 'pros encontrados'} para la cuenta{' '}
            <span className="font-mono text-white">#{data.account_id}</span>
          </span>
        </p>

        <span className="hidden rounded-full border border-dota-border px-3 py-1 text-xs text-gray-600 sm:block">
          Datos de OpenDota
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-dota-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dota-border bg-dota-surface">
              {HEADERS.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-gray-500 whitespace-nowrap"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.pros.map((pro, index) => (
              <ProEncounterRow key={pro.account_id} pro={pro} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
