import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import { getSharedMatches } from '../services/openDota.service'
import type { AppError } from '../middleware/errorHandler'

const router = Router()

/**
 * GET /api/pro-matches/:accountId/:proAccountId
 * Returns the shared match history between a user and a specific pro player.
 */
router.get('/:accountId/:proAccountId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId, proAccountId } = req.params

    if (!/^\d+$/.test(accountId) || !/^\d+$/.test(proAccountId)) {
      const err = new Error('Invalid Account ID. Numbers only.') as AppError
      err.status = 400
      return next(err)
    }

    const matches = await getSharedMatches(
      parseInt(accountId, 10),
      parseInt(proAccountId, 10),
    )

    res.json({
      account_id: parseInt(accountId, 10),
      pro_account_id: parseInt(proAccountId, 10),
      matches,
    })
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
