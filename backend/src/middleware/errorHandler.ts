import type { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  status?: number
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err.status ?? 500
  const message = err.message ?? 'Internal server error'

  if (status >= 500) {
    console.error(`[ERROR] ${status} - ${message}`, err.stack)
  }

  res.status(status).json({ error: message, status })
}
