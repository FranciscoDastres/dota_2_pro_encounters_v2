import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'

const router = Router()

/**
 * GET /api/pro-encounters/:steamId
 * Phase 2 will implement the full logic here.
 */
router.get('/:steamId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { steamId } = req.params

    // TODO: implement in Phase 2
    res.json({
      steam_id: steamId,
      message: 'Pro encounters endpoint — Phase 2 pending',
    })
  } catch (err) {
    next(err)
  }
})

export default router
