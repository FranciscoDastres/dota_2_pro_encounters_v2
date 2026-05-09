import type { CarryComparisonResponse } from '../types'

interface Props {
  data: CarryComparisonResponse
  loading?: boolean
}

function formatMetricValue(value: number): string {
  return Math.abs(value) >= 1000 ? Math.round(value).toLocaleString() : value.toLocaleString()
}

function formatDifference(value: number): string {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${formatMetricValue(value)}`
}

function timingLabel(status: CarryComparisonResponse['item_timings'][number]['status']): string {
  if (status === 'on_time') return 'On time'
  if (status === 'late') return 'Late'
  return 'Missing'
}

export function CarryComparisonPanel({ data, loading = false }: Props) {
  if (loading) {
    return (
      <section className="rounded-lg border border-cyan-400/20 bg-dota-surface/80 p-4 shadow-[0_0_32px_rgba(0,194,255,0.08)]">
        <div className="mb-4 h-5 w-52 animate-pulse rounded bg-cyan-300/20" />
        <div className="space-y-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-11 animate-pulse rounded bg-white/5" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-cyan-400/25 bg-[#070b12]/95 p-4 shadow-[0_0_36px_rgba(0,194,255,0.12)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">
            Hard Carry Benchmark
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Efficiency Gap: {(data.efficiency_gap.score * 100).toFixed(0)}%
          </h2>
        </div>

        <div className={[
          'rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]',
          data.fulfilled_role
            ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-200'
            : 'border-rose-300/40 bg-rose-400/10 text-rose-200',
        ].join(' ')}
        >
          {data.fulfilled_role ? 'Role Met' : 'Role Gap'}
        </div>
      </div>

      <p className="mb-4 border-l-2 border-cyan-300/60 pl-3 text-sm text-slate-300">
        {data.efficiency_gap.feedback}
      </p>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase tracking-[0.16em] text-cyan-200/70">
              <th className="px-4 py-3 font-medium">Metric</th>
              <th className="px-4 py-3 text-right font-medium">Your Value</th>
              <th className="px-4 py-3 text-right font-medium">Pro Value</th>
              <th className="px-4 py-3 text-right font-medium">Difference</th>
            </tr>
          </thead>
          <tbody>
            {data.metrics.map((metric) => (
              <tr key={metric.key} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 font-medium text-white">{metric.label}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-200">
                  {formatMetricValue(metric.userValue)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-cyan-200">
                  {formatMetricValue(metric.proValue)}
                </td>
                <td className={[
                  'px-4 py-3 text-right font-mono',
                  metric.difference >= 0 ? 'text-emerald-300' : 'text-rose-300',
                ].join(' ')}
                >
                  {formatDifference(metric.difference)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {data.item_timings.map((timing) => (
          <div key={timing.itemKey} className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium text-white">{timing.itemName}</span>
              <span className={[
                'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                timing.status === 'on_time'
                  ? 'bg-emerald-400/10 text-emerald-200'
                  : timing.status === 'late'
                    ? 'bg-amber-400/10 text-amber-200'
                    : 'bg-rose-400/10 text-rose-200',
              ].join(' ')}
              >
                {timingLabel(timing.status)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              You: {timing.userMinute ?? '-'} min · Pro: {timing.proMinute} min
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
