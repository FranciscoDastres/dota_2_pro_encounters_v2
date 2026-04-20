import type { ProEncounter } from '../types'
import { formatDate, formatWinRate, countryCodeToFlag } from '../utils/formatters'

interface Props {
  pro: ProEncounter
  index: number
}

export function ProEncounterRow({ pro, index }: Props) {
  const winRate = formatWinRate(pro.games, pro.win)
  const winPct = pro.games > 0 ? Math.round((pro.win / pro.games) * 100) : 0
  const isWinning = pro.games > 0 && pro.win / pro.games >= 0.5

  return (
    <tr
      className="group animate-fade-up border-b border-dota-border transition-colors hover:bg-dota-surface/60"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {/* Avatar */}
      <td className="px-4 py-3">
        <img
          src={pro.avatarfull}
          alt={`Avatar de ${pro.personaname}`}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-dota-border transition-all group-hover:ring-dota-gold/40"
        />
      </td>

      {/* Player name */}
      <td className="px-4 py-3">
        <a
          href={pro.profileurl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-dota-gold transition-colors hover:text-dota-gold-light"
        >
          {pro.personaname}
        </a>
      </td>

      {/* Team */}
      <td className="px-4 py-3 text-gray-300">
        {pro.team_name ?? <span className="text-gray-700">—</span>}
      </td>

      {/* Last match */}
      <td className="whitespace-nowrap px-4 py-3 text-gray-400">
        {formatDate(pro.last_match_time)}
      </td>

      {/* Games */}
      <td className="px-4 py-3 text-center font-mono text-white">{pro.games}</td>

      {/* Wins */}
      <td className="px-4 py-3 text-center font-mono text-dota-radiant">{pro.win}</td>

      {/* Win% with mini bar */}
      <td className="px-4 py-3">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-sm font-mono ${isWinning ? 'text-dota-radiant' : 'text-dota-dire'}`}>
            {winRate}
          </span>
          {pro.games > 0 && (
            <div className="h-1 w-12 overflow-hidden rounded-full bg-dota-border">
              <div
                className={`h-full rounded-full transition-all ${isWinning ? 'bg-dota-radiant' : 'bg-dota-dire'}`}
                style={{ width: `${winPct}%` }}
              />
            </div>
          )}
        </div>
      </td>

      {/* Country */}
      <td
        className="px-4 py-3 text-center text-lg"
        title={pro.country_code ?? undefined}
      >
        {countryCodeToFlag(pro.country_code)}
      </td>
    </tr>
  )
}
