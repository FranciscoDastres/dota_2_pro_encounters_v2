import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import { getPlayerPros } from '../services/openDota.service'
import type { AppError } from '../middleware/errorHandler'

const router = Router()

/**
 * GET /api/pro-encounters/:accountId
 * Returns all pro players a given Dota 2 account has played with/against.
 */
router.get('/:accountId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params

    if (!/^\d+$/.test(accountId)) {
      const err = new Error('Account ID inválido. Debe contener solo números.') as AppError
      err.status = 400
      return next(err)
    }

    const accountIdNum = parseInt(accountId, 10)
    const pros = await getPlayerPros(accountIdNum)

    res.json({ account_id: accountIdNum, pros })
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      const appErr = new Error(
        status === 429
          ? 'OpenDota ha limitado las solicitudes. Intenta en unos segundos.'
          : 'No se pudo conectar con la API de OpenDota.',
      ) as AppError
      appErr.status = status === 429 ? 429 : 503
      return next(appErr)
    }
    next(err)
  }
})

export default router
