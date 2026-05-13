import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGetMatchDetails = vi.fn()
const mockGetHeroBenchmarks = vi.fn()

vi.mock('../services/openDota.service', () => ({
  getMatchDetails: mockGetMatchDetails,
  getHeroBenchmarks: mockGetHeroBenchmarks,
}))

const { getCarryComparison } = await import('../services/carryComparison.service')

describe('getCarryComparison', () => {
  beforeEach(() => {
    mockGetMatchDetails.mockReset()
    mockGetHeroBenchmarks.mockReset()
  })

  it('uses the explicit matchId and heroId from the dashboard state', async () => {
    mockGetMatchDetails.mockResolvedValueOnce({
      match_id: 9001,
      duration: 2400,
      players: [
        {
          account_id: 12345,
          hero_id: 41,
          gold_per_min: 760,
          xp_per_min: 810,
          last_hits: 340,
          hero_damage: 28000,
          tower_damage: 5000,
          deaths: 1,
          purchase_log: [{ time: 780, key: 'maelstrom' }],
          deaths_log: [],
        },
      ],
    })

    mockGetHeroBenchmarks.mockResolvedValueOnce({
      hero_id: 41,
      result: {
        gold_per_min: [{ percentile: 99, value: 720 }],
        last_hits_per_min: [{ percentile: 99, value: 8.8 }],
        xp_per_min: [{ percentile: 99, value: 780 }],
      },
    })

    const result = await getCarryComparison({
      accountId: 12345,
      matchId: 9001,
      heroId: 41,
      percentile: 99,
    })

    expect(mockGetMatchDetails).toHaveBeenCalledWith(9001)
    expect(mockGetHeroBenchmarks).toHaveBeenCalledWith(41)
    expect(result.match_id).toBe(9001)
    expect(result.hero_id).toBe(41)
  })
})
