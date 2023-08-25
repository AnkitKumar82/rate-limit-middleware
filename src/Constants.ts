import {
  ErrorConstants
} from './Types'

export const STORE_ENUM = {
  IN_MEMORY: 'IN_MEMORY',
  REDIS: 'REDIS'
}

export const DEFAULT_CONFIG = {
  timeFrameInMs: 10000,
  maxHits: 10,
  message: 'Too Many Requests',
  statusCode: 429,
  store: STORE_ENUM.IN_MEMORY
}

export const ERRORS: ErrorConstants = {
  INVALID_CONFIG: {
    name: 'RL::INVALID_CONFIG',
    message: 'Invalid config'
  },
  INVALID_MEMORY_STORE: {
    name: 'RL::INVALID_MEMORY_STORE',
    message: 'Invalid Memory Store'
  }
}
