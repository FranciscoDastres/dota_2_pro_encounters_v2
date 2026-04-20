import dotenv from 'dotenv'

dotenv.config()

export const env = {
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  OPENDOTA_API_URL: process.env.OPENDOTA_API_URL ?? 'https://api.opendota.com/api',
  OPENDOTA_API_KEY: process.env.OPENDOTA_API_KEY ?? '',
  get isDevelopment() {
    return this.NODE_ENV === 'development'
  },
  get isProduction() {
    return this.NODE_ENV === 'production'
  },
} as const
