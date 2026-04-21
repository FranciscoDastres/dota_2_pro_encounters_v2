import app from './app'
import { env } from './config/env'
import { logger } from './config/logger'
import { startKeepAlive } from './keepAlive'

app.listen(env.PORT, '0.0.0.0', () => {
  logger.info('server started', { port: env.PORT, env: env.NODE_ENV })
  startKeepAlive()
})
