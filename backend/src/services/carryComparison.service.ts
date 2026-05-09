import { z } from 'zod'
import {
  getHeroBenchmarks,
  getLatestPlayerMatches,
  getMatchDetails,
} from './openDota.service'

const CORE_ITEM_TIMINGS_BY_HERO: Record<number, Record<string, { label: string; optimalMinute: number; graceMinutes: number }>> = {
  1: {
    power_treads: { label: 'Power Treads', optimalMinute: 8, graceMinutes: 2 },
    bfury: { label: 'Battle Fury', optimalMinute: 14, graceMinutes: 2 },
    manta: { label: 'Manta Style', optimalMinute: 21, graceMinutes: 3 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 25, graceMinutes: 3 },
  },
  6: {
    power_treads: { label: 'Power Treads', optimalMinute: 7, graceMinutes: 2 },
    hurricane_pike: { label: 'Hurricane Pike', optimalMinute: 16, graceMinutes: 3 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 22, graceMinutes: 3 },
  },
  8: {
    phase_boots: { label: 'Phase Boots', optimalMinute: 7, graceMinutes: 2 },
    maelstrom: { label: 'Maelstrom', optimalMinute: 13, graceMinutes: 2 },
    manta: { label: 'Manta Style', optimalMinute: 20, graceMinutes: 3 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 24, graceMinutes: 3 },
  },
  18: {
    power_treads: { label: 'Power Treads', optimalMinute: 7, graceMinutes: 2 },
    echo_sabre: { label: 'Echo Sabre', optimalMinute: 13, graceMinutes: 2 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 20, graceMinutes: 3 },
  },
  41: {
    power_treads: { label: 'Power Treads', optimalMinute: 8, graceMinutes: 2 },
    maelstrom: { label: 'Maelstrom', optimalMinute: 14, graceMinutes: 2 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 22, graceMinutes: 3 },
  },
  44: {
    power_treads: { label: 'Power Treads', optimalMinute: 8, graceMinutes: 2 },
    bfury: { label: 'Battle Fury', optimalMinute: 15, graceMinutes: 2 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 23, graceMinutes: 3 },
  },
  48: {
    power_treads: { label: 'Power Treads', optimalMinute: 7, graceMinutes: 2 },
    mask_of_madness: { label: 'Mask of Madness', optimalMinute: 11, graceMinutes: 2 },
    manta: { label: 'Manta Style', optimalMinute: 19, graceMinutes: 3 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 24, graceMinutes: 3 },
  },
  54: {
    phase_boots: { label: 'Phase Boots', optimalMinute: 7, graceMinutes: 2 },
    radiance: { label: 'Radiance', optimalMinute: 16, graceMinutes: 2 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 23, graceMinutes: 3 },
  },
  72: {
    power_treads: { label: 'Power Treads', optimalMinute: 7, graceMinutes: 2 },
    maelstrom: { label: 'Maelstrom', optimalMinute: 13, graceMinutes: 2 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 22, graceMinutes: 3 },
  },
  94: {
    power_treads: { label: 'Power Treads', optimalMinute: 8, graceMinutes: 2 },
    manta: { label: 'Manta Style', optimalMinute: 18, graceMinutes: 3 },
    butterfly: { label: 'Butterfly', optimalMinute: 27, graceMinutes: 4 },
  },
  109: {
    power_treads: { label: 'Power Treads', optimalMinute: 8, graceMinutes: 2 },
    manta: { label: 'Manta Style', optimalMinute: 18, graceMinutes: 3 },
    black_king_bar: { label: 'Black King Bar', optimalMinute: 24, graceMinutes: 3 },
  },
}

const DEFAULT_CORE_TIMINGS = {
  power_treads: { label: 'Power Treads', optimalMinute: 8, graceMinutes: 2 },
  maelstrom: { label: 'Maelstrom', optimalMinute: 14, graceMinutes: 2 },
  black_king_bar: { label: 'Black King Bar', optimalMinute: 23, graceMinutes: 3 },
}

export const openDotaPlayerMatchSchema = z.object({
  match_id: z.number(),
  hero_id: z.number(),
})

export const openDotaPurchaseLogSchema = z.object({
  time: z.number(),
  key: z.string(),
})

export const openDotaDeathLogSchema = z.object({
  time: z.number(),
}).passthrough()

export const openDotaMatchPlayerSchema = z.object({
  account_id: z.number().optional(),
  hero_id: z.number(),
  gold_per_min: z.number(),
  xp_per_min: z.number(),
  last_hits: z.number(),
  hero_damage: z.number(),
  tower_damage: z.number(),
  deaths: z.number().nonnegative().default(0),
  purchase_log: z.array(openDotaPurchaseLogSchema).default([]),
  deaths_log: z.array(openDotaDeathLogSchema).default([]),
})

export const openDotaMatchSchema = z.object({
  match_id: z.number(),
  duration: z.number().positive(),
  players: z.array(openDotaMatchPlayerSchema),
})

const benchmarkValueSchema = z.object({
  percentile: z.number(),
  value: z.number(),
})

export const openDotaBenchmarksSchema = z.object({
  hero_id: z.number(),
  result: z.object({
    gold_per_min: z.array(benchmarkValueSchema),
    last_hits_per_min: z.array(benchmarkValueSchema),
    xp_per_min: z.array(benchmarkValueSchema).optional(),
    hero_damage_per_min: z.array(benchmarkValueSchema).optional(),
    tower_damage: z.array(benchmarkValueSchema).optional(),
  }),
})

export interface CarryComparisonMetric {
  key: 'gold_per_min' | 'xp_per_min' | 'last_hits_per_10' | 'hero_damage' | 'tower_damage'
  label: string
  userValue: number
  proValue: number
  difference: number
  ratio: number
  passed: boolean
}

export interface CarryItemTimingComparison {
  itemKey: string
  itemName: string
  userMinute: number | null
  proMinute: number
  differenceMinutes: number | null
  status: 'on_time' | 'late' | 'missing'
}

export interface CarryComparisonResponse {
  account_id: number
  match_id: number
  hero_id: number
  benchmark_percentile: 95 | 99
  scenario: 'stomp' | 'comeback'
  fulfilled_role: boolean
  efficiency_gap: {
    score: number
    gpmRatio: number
    lh10Ratio: number
    feedback: string
  }
  metrics: CarryComparisonMetric[]
  item_timings: CarryItemTimingComparison[]
  raw_user: {
    gold_per_min: number
    xp_per_min: number
    last_hits: number
    hero_damage: number
    tower_damage: number
    purchase_log: z.infer<typeof openDotaPurchaseLogSchema>[]
  }
}

function pickBenchmarkValue(values: z.infer<typeof benchmarkValueSchema>[], target: 95 | 99): number {
  const sorted = [...values].sort((a, b) => a.percentile - b.percentile)
  return sorted.find((entry) => entry.percentile >= target)?.value ?? sorted.at(-1)?.value ?? 0
}

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function buildMetric(
  key: CarryComparisonMetric['key'],
  label: string,
  userValue: number,
  proValue: number,
  thresholdRatio = 0.8,
): CarryComparisonMetric {
  const ratio = proValue > 0 ? userValue / proValue : 1
  return {
    key,
    label,
    userValue: round(userValue),
    proValue: round(proValue),
    difference: round(userValue - proValue),
    ratio: round(ratio, 3),
    passed: ratio >= thresholdRatio,
  }
}

function compareItemTimings(heroId: number, purchaseLog: z.infer<typeof openDotaPurchaseLogSchema>[]): CarryItemTimingComparison[] {
  const timings = CORE_ITEM_TIMINGS_BY_HERO[heroId] ?? DEFAULT_CORE_TIMINGS

  return Object.entries(timings).map(([itemKey, target]) => {
    const purchase = purchaseLog.find((entry) => entry.key === itemKey)
    const userMinute = purchase ? round(purchase.time / 60) : null
    const differenceMinutes = userMinute === null ? null : round(userMinute - target.optimalMinute)
    const status =
      userMinute === null
        ? 'missing'
        : userMinute <= target.optimalMinute + target.graceMinutes
          ? 'on_time'
          : 'late'

    return {
      itemKey,
      itemName: target.label,
      userMinute,
      proMinute: target.optimalMinute,
      differenceMinutes,
      status,
    }
  })
}

export function compareCarryPerformance(params: {
  accountId: number
  match: z.infer<typeof openDotaMatchSchema>
  player: z.infer<typeof openDotaMatchPlayerSchema>
  benchmarks: z.infer<typeof openDotaBenchmarksSchema>
  percentile?: 95 | 99
}): CarryComparisonResponse {
  const percentile = params.percentile ?? 95
  const durationMinutes = params.match.duration / 60
  const proGpm = pickBenchmarkValue(params.benchmarks.result.gold_per_min, percentile)
  const proLh10 = pickBenchmarkValue(params.benchmarks.result.last_hits_per_min, percentile) * 10
  const userLh10 = durationMinutes > 0 ? (params.player.last_hits / durationMinutes) * 10 : 0
  const proXp = params.benchmarks.result.xp_per_min
    ? pickBenchmarkValue(params.benchmarks.result.xp_per_min, percentile)
    : params.player.xp_per_min
  const proHeroDamage = params.benchmarks.result.hero_damage_per_min
    ? pickBenchmarkValue(params.benchmarks.result.hero_damage_per_min, percentile) * durationMinutes
    : params.player.hero_damage
  const proTowerDamage = params.benchmarks.result.tower_damage
    ? pickBenchmarkValue(params.benchmarks.result.tower_damage, percentile)
    : params.player.tower_damage

  const itemTimings = compareItemTimings(params.player.hero_id, params.player.purchase_log)
  const deathsBeforeMinute10 = params.player.deaths_log.filter((death) => death.time <= 600).length
  const scenario: CarryComparisonResponse['scenario'] = deathsBeforeMinute10 > 2 ? 'comeback' : 'stomp'

  const metrics = [
    buildMetric('gold_per_min', 'GPM', params.player.gold_per_min, proGpm),
    buildMetric('xp_per_min', 'XPM', params.player.xp_per_min, proXp),
    buildMetric('last_hits_per_10', 'LH/10', userLh10, proLh10),
    buildMetric('hero_damage', 'Hero Damage', params.player.hero_damage, proHeroDamage, 0.65),
    buildMetric('tower_damage', 'Tower Damage', params.player.tower_damage, proTowerDamage, 0.65),
  ]

  const gpmRatio = proGpm > 0 ? params.player.gold_per_min / proGpm : 1
  const lh10Ratio = proLh10 > 0 ? userLh10 / proLh10 : 1
  const timingPenalty = itemTimings.some((timing) => timing.status !== 'on_time') ? 0.08 : 0
  const score = Math.max(0, Math.min(1, (gpmRatio * 0.55) + (lh10Ratio * 0.35) + ((1 - timingPenalty) * 0.1)))
  const fulfilledRole = gpmRatio >= 0.8 && lh10Ratio >= 0.8 && itemTimings.every((timing) => timing.status !== 'missing')
  const feedback = gpmRatio < 0.8
    ? 'Tu ruta de farming está dejando recursos en el mapa. Un jugador Pro optimiza el paso entre campamentos neutrales y oleadas'
    : fulfilledRole
      ? 'Cumpliste el rol de Hard Carry: tu economía y tus timings están cerca del estándar profesional.'
      : 'Tu economía está cerca del estándar, pero tus last hits o timings core todavía abren una brecha de eficiencia.'

  return {
    account_id: params.accountId,
    match_id: params.match.match_id,
    hero_id: params.player.hero_id,
    benchmark_percentile: percentile,
    scenario,
    fulfilled_role: fulfilledRole,
    efficiency_gap: {
      score: round(score, 3),
      gpmRatio: round(gpmRatio, 3),
      lh10Ratio: round(lh10Ratio, 3),
      feedback,
    },
    metrics,
    item_timings: itemTimings,
    raw_user: {
      gold_per_min: params.player.gold_per_min,
      xp_per_min: params.player.xp_per_min,
      last_hits: params.player.last_hits,
      hero_damage: params.player.hero_damage,
      tower_damage: params.player.tower_damage,
      purchase_log: params.player.purchase_log,
    },
  }
}

export async function getCarryComparison(accountId: number, percentile: 95 | 99 = 95): Promise<CarryComparisonResponse> {
  const latestMatches = z.array(openDotaPlayerMatchSchema).parse(await getLatestPlayerMatches(accountId, 1))
  const latestMatch = latestMatches[0]

  if (!latestMatch) {
    throw new Error('No recent OpenDota matches found for this account.')
  }

  const match = openDotaMatchSchema.parse(await getMatchDetails(latestMatch.match_id))
  const player = match.players.find((entry) => entry.account_id === accountId)

  if (!player) {
    throw new Error('The account was not found in the parsed OpenDota match payload.')
  }

  const benchmarks = openDotaBenchmarksSchema.parse(await getHeroBenchmarks(player.hero_id))

  return compareCarryPerformance({
    accountId,
    match,
    player,
    benchmarks,
    percentile,
  })
}
