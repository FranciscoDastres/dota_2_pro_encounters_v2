import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import { apiLimiter } from './middleware/rateLimiter'
import { errorHandler } from './middleware/errorHandler'
import apiRouter from './routes'

const app = express()

app.use(helmet())

app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ['GET'],
    optionsSuccessStatus: 200,
  }),
)

app.use(express.json())

app.use('/api', apiLimiter)
app.use('/api', apiRouter)

// Must be registered last
app.use(errorHandler)

export default app
