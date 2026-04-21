import app from './app'
import { env } from './config/env'
import { startKeepAlive } from './keepAlive'

app.listen(env.PORT, () => {
  console.log(`[server] Running on http://localhost:${env.PORT} (${env.NODE_ENV})`)
  startKeepAlive()
})
