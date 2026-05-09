import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import { getCarryComparison } from '../services/carryComparison.service'
import type { AppError } from '../middleware/errorHandler'
import { validateParams } from '../middleware/validate'
import { carryComparisonParamsSchema } from '../schemas/params.schema'

const router = Router()

/**
 * GET /api/carry-comparison/:accountId?percentile=95|99
 * Compares the player's latest match against OpenDota hero benchmarks for carry KPIs.
 */
router.get('/:accountId', validateParams(carryComparisonParamsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params
    const percentile = req.query.percentile === '99' ? 99 : 95
    const comparison = await getCarryComparison(parseInt(accountId, 10), percentile)

    res.json(comparison)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      const appErr = new Error(
        status === 429
          ? 'OpenDota rate limit reached. Please try again in a few seconds.'
          : 'Could not connect to the OpenDota API.',
      ) as AppError
      appErr.status = status === 429 ? 429 : 503
      return next(appErr)
    }
    next(err)
  }
})

export default router
