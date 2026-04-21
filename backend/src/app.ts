import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { morganStream } from './config/logger'
import { apiLimiter } from './middleware/rateLimiter'
import { errorHandler } from './middleware/errorHandler'
import apiRouter from './routes'

const app = express()

app.use(helmet())
app.use(morgan(env.isDevelopment ? 'dev' : 'combined', { stream: morganStream }))

const allowedOrigins = env.isDevelopment
  ? [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173']
  : [env.FRONTEND_URL]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no Origin header) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
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
