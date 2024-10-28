import type {
  InputPayload,
  Payload,
  WalletOperationErrorPayload,
  WalletOperationErrorPayloadErrorItem,
  InternalErrorType,
} from './error.type'
import { ERROR_TYPE_FATAL } from './error.const'

/**
 * ExtendedErrorClass as base class. Contains all essential information
 * for error. You can create another extened class from it. See examples below (ValidationError, PropertyError etc.)
 */
class ExtendedErrorClass extends Error {
  payload: Payload | InputPayload | WalletOperationErrorPayload

  constructor(messageOrError: string | Error, payload: Payload = {}) {
    const message = messageOrError instanceof Error ? messageOrError.message : messageOrError
    const rawStack = messageOrError instanceof Error ? messageOrError.stack : undefined
    super(message)
    this.name = this.constructor.name
    const stack = rawStack?.replace(/^.+\n/, `${this.name}: ${this.message}\n`)
    this.payload = payload
    if (stack) {
      this.stack = stack
    }
  }

  /**
   * Update place where error happens
   *
   * @returns updated error
   */
  setScope(scope: string): this {
    this.payload.scope = scope
    return this
  }

  /**  */
  toString(): string {
    return `${this.name}: ${this.message} ${JSON.stringify(this.payload)}`
  }
}

/** bad api data when making rest call */
export class ValidationError extends ExtendedErrorClass {}
/** when getting server error (f.e. 500 ) */
export class ApiError extends ExtendedErrorClass {}
/** critiacal error, show 404 page */
export class FatalError extends ExtendedErrorClass {
  type: InternalErrorType

  constructor(messageOrError: string | Error, payload: Payload = {}, type: InternalErrorType = ERROR_TYPE_FATAL) {
    super(messageOrError, payload)
    this.type = type
  }
}

/**
 *
 */
export class WalletOperationError extends ExtendedErrorClass {
  id?: string
  kind?: string
  errors?: WalletOperationErrorPayloadErrorItem[]
  errorDetails?: string
}

// this one for all errors
export type CustomErrors = Error | ApiError | ValidationError | FatalError | WalletOperationError | null
// this one only for extended error, so you know it is NOT null and NOT simple Error
export type ExtendedError = FatalError | ApiError | ValidationError | WalletOperationError

/**
 * Function checks the error type based on payload similarity
 * PropertyError doesn't included intentionally
 * @param e any error type
 * @returns true if this is extendedError
 */
export function isExtendedError(e: unknown): e is ExtendedError {
  return (
    e instanceof FatalError ||
    e instanceof ApiError ||
    e instanceof ValidationError ||
    e instanceof WalletOperationError
  )
}

/**
 * Convert unknown to Error object or keep if it was error
 * @param rawError unknown
 * @returns Error or Extended Error class
 */
export function unknownToError(rawError: unknown): Error | ExtendedError {
  if (isExtendedError(rawError)) return rawError
  if (rawError instanceof Error) return rawError
  if (typeof rawError === 'string') return new Error(rawError)

  return new Error('unknown Error with no message, stack and payload')
}

export function isAbortError(rawError: unknown): boolean {
  const typedError = unknownToError(rawError)

  if (typedError.name === 'AbortError') return true

  return false
}
