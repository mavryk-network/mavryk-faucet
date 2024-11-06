import { z } from 'zod'

export const walletOperationErrorPayloadErrorItemSchema = z.record(z.string(), z.unknown())

export const walletOparationErrorPayload = z.object({
  errors: z.array(walletOperationErrorPayloadErrorItemSchema).optional(),
  errorDetails: z.string().optional(),
  id: z.string(),
  kind: z.string(),
  name: z.string(),
  message: z.string(),
  scope: z.string().optional(),
})
