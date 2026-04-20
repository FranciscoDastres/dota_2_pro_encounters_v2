import type { ProEncounter } from '../types'
import { formatDate, formatWinRate, countryCodeToFlag } from '../utils/formatters'

interface Props {
  pro: ProEncounter
}

export function ProEncounterRow({ pro }: Props) {
  const winRate = formatWinRate(pro.games, pro.win)
  const isWinning = pro.games > 0 && pro.win / pro.games >= 0.5

  return (
    <tr className="border-b border-dota-border hover:bg-dota-surface/50 transition-colors">
      <td className="px-4 py-3">
        <img
          src={pro.avatarfull}
          alt={`Avatar de ${pro.personaname}`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="px-4 py-3">
        <a
          href={pro.profileurl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dota-gold hover:text-dota-gold-light transition-colors font-medium"
        >
          {pro.personaname}
        </a>
      </td>
      <td className="px-4 py-3 text-gray-300">
        {pro.team_name ?? <span className="text-gray-600">—</span>}
      </td>
      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
        {formatDate(pro.last_match_time)}
      </td>
      <td className="px-4 py-3 text-center text-white font-mono">{pro.games}</td>
      <td className="px-4 py-3 text-center text-dota-radiant font-mono">{pro.win}</td>
      <td className="px-4 py-3 text-center font-mono">
        <span className={isWinning ? 'text-dota-radiant' : 'text-dota-dire'}>{winRate}</span>
      </td>
      <td className="px-4 py-3 text-center text-lg" title={pro.country_code ?? undefined}>
        {countryCodeToFlag(pro.country_code)}
      </td>
    </tr>
  )
}
