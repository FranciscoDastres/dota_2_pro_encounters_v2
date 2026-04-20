import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import { getPlayerProsWithCache } from '../services/cache.service'
import type { AppError } from '../middleware/errorHandler'

const router = Router()

/**
 * GET /api/pro-encounters/:accountId
 * Returns all pro players a given Dota 2 account has played with/against.
 * Responses are served from Supabase cache (TTL 1h) when available.
 */
router.get('/:accountId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params

    if (!/^\d+$/.test(accountId)) {
      const err = new Error('Invalid Account ID. Numbers only.') as AppError
      err.status = 400
      return next(err)
    }

    const accountIdNum = parseInt(accountId, 10)
    const pros = await getPlayerProsWithCache(accountIdNum)

    res.json({ account_id: accountIdNum, pros })
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
