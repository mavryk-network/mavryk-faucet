import { ERROR_TYPE_FATAL, ERROR_TYPE_ROUTER } from './error.const'
import { z } from 'zod'
import {
  walletOparationErrorPayload,
  walletOperationErrorPayloadErrorItemSchema,
} from './error.schema'

export type InputPayload = {
  field?: string
  scope?: string
  code?: number
}

export type Payload = {
  code?: number
  data?: unknown
  scope?: string
}

export type WalletOperationErrorPayloadErrorItem = z.infer<typeof walletOperationErrorPayloadErrorItemSchema>
export type WalletOperationErrorPayload = z.infer<typeof walletOparationErrorPayload>
export type InternalErrorType = typeof ERROR_TYPE_ROUTER | typeof ERROR_TYPE_FATAL
