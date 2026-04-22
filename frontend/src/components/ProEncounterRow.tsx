import { useState } from 'react'
import type { ProEncounter } from '../types'
import { formatDate, formatWinRate, countryCodeToFlag } from '../utils/formatters'
import { MatchHistory } from './MatchHistory'

interface Props {
  pro: ProEncounter
  index: number
  accountId: number
}

export function ProEncounterRow({ pro, index, accountId }: Props) {
  const [expanded, setExpanded] = useState(false)

  const winRate = formatWinRate(pro.games, pro.win)
  const winPct = pro.games > 0 ? Math.round((pro.win / pro.games) * 100) : 0
  const isWinning = pro.games > 0 && pro.win / pro.games >= 0.5

  return (
    <>
      <tr
        className="group animate-fade-up border-b border-dota-border transition-colors hover:bg-dota-surface/60"
        style={{ animationDelay: `${index * 55}ms` }}
      >
        {/* Avatar */}
        <td className="px-4 py-3">
          <img
            src={pro.avatarfull}
            alt={`${pro.personaname}'s avatar`}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-dota-border transition-all group-hover:ring-dota-gold/40"
          />
        </td>

        {/* Player name */}
        <td className="px-4 py-3">
          <a
            href={pro.profileurl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/name flex flex-col gap-0.5"
          >
            {pro.name ? (
              <>
                <span className="font-semibold text-white transition-colors group-hover/name:text-dota-gold-light">
                  <span className="mr-1 font-mono text-[9px] uppercase tracking-wider text-dota-gold/50">scene</span>
                  {pro.name}
                </span>
                <span className="text-xs text-gray-500 transition-colors group-hover/name:text-gray-400">
                  <span className="mr-1 font-mono text-[9px] uppercase tracking-wider text-gray-700">steam</span>
                  {pro.personaname}
                </span>
              </>
            ) : (
              <span className="font-medium text-dota-gold transition-colors group-hover/name:text-dota-gold-light">
                {pro.personaname}
              </span>
            )}
          </a>
        </td>

        {/* Team */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${pro.team_name ? 'bg-dota-radiant' : 'bg-gray-700'}`}
              title={pro.team_name ? 'Active team' : 'No team'}
            />
            <span className={pro.team_name ? 'text-gray-300' : 'text-gray-700'}>
              {pro.team_name ?? '—'}
            </span>
          </div>
        </td>

        {/* Last match */}
        <td className="whitespace-nowrap px-4 py-3 text-gray-400">
          {formatDate(pro.last_match_time)}
        </td>

        {/* Games */}
        <td className="px-4 py-3 text-center font-mono text-white">{pro.games}</td>

        {/* Wins */}
        <td className="px-4 py-3 text-center font-mono text-dota-radiant">{pro.win}</td>

        {/* Losses */}
        <td className="px-4 py-3 text-center font-mono text-dota-dire">{pro.games - pro.win}</td>

        {/* Win% with mini bar + ally/enemy breakdown */}
        <td className="px-4 py-3">
          <div className="flex flex-col items-center gap-1">
            <span
              className={`text-sm font-mono ${
                isWinning ? 'text-dota-radiant' : 'text-dota-dire'
              }`}
            >
              {winRate}
            </span>
            {pro.games > 0 && (
              <div className="h-1 w-12 overflow-hidden rounded-full bg-dota-border">
                <div
                  className={`h-full rounded-full transition-all ${
                    isWinning ? 'bg-dota-radiant' : 'bg-dota-dire'
                  }`}
                  style={{ width: `${winPct}%` }}
                />
              </div>
            )}
            {/* Ally / Enemy win rate breakdown */}
            {((pro.with_games ?? 0) > 0 || (pro.against_games ?? 0) > 0) && (
              <div className="flex gap-1.5 text-[10px] font-mono">
                {(pro.with_games ?? 0) > 0 && (
                  <span className="text-dota-radiant/70">
                    W/{Math.round(((pro.with_win ?? 0) / pro.with_games!) * 100)}%
                  </span>
                )}
                {(pro.with_games ?? 0) > 0 && (pro.against_games ?? 0) > 0 && (
                  <span className="text-gray-700">·</span>
                )}
                {(pro.against_games ?? 0) > 0 && (
                  <span className="text-dota-dire/70">
                    vs {Math.round(((pro.against_win ?? 0) / pro.against_games!) * 100)}%
                  </span>
                )}
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

        {/* Expand toggle */}
        <td className="whitespace-nowrap px-4 py-3 text-right">
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Collapse match history' : 'Show match history'}
            className={[
              'cursor-pointer rounded-md border px-3 py-1 text-[11px] font-medium transition-all whitespace-nowrap',
              expanded
                ? 'border-dota-gold/50 bg-dota-gold/10 text-dota-gold'
                : 'border-dota-border text-gray-600 hover:border-dota-gold/40 hover:text-dota-gold',
            ].join(' ')}
          >
            {expanded ? '▲ Hide' : '▼ Matches'}
          </button>
        </td>
      </tr>

      {/* Expanded match history */}
      {expanded && (
        <tr className="border-b border-dota-border/50">
          <td
            colSpan={10}
            className="bg-dota-darker/60 px-6 py-4"
          >
            <MatchHistory accountId={accountId} proAccountId={pro.account_id} />
          </td>
        </tr>
      )}
    </>
  )
}
