import { z } from 'zod'

// Dota 2 account IDs are 32-bit unsigned integers (Steam ID3 format): 1–4 294 967 295
const accountIdField = z
  .string()
  .regex(/^\d+$/, 'Invalid account ID: numbers only')
  .refine(
    (val) => {
      const n = Number(val)
      return n >= 1 && n <= 4_294_967_295
    },
    { message: 'Account ID must be between 1 and 4 294 967 295' },
  )

export const proEncountersParamsSchema = z.object({
  accountId: accountIdField,
})

export const proMatchesParamsSchema = z.object({
  accountId: accountIdField,
  proAccountId: accountIdField,
})
