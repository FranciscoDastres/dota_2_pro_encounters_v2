import { Router } from 'express'
import proEncountersRouter from './proEncounters.route'
import proMatchesRouter from './proMatches.route'

const router = Router()

router.use('/pro-encounters', proEncountersRouter)
router.use('/pro-matches', proMatchesRouter)

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
