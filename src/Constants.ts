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
  store: STORE_ENUM.IN_MEMORY,
  prefix: ''
}

export const ERRORS: ErrorConstants = {
  INVALID_CONFIG: {
    name: 'RL::INVALID_CONFIG',
    message: 'Invalid config',
    status: 400
  },
  INVALID_MEMORY_STORE: {
    name: 'RL::INVALID_MEMORY_STORE',
    message: 'Invalid Memory Store',
    status: 400
  },
  INVALID_REDIS_CONFIG: {
    name: 'RL::INVALID_REDIS_CONFIG',
    message: 'Invalid Redis Config',
    status: 400
  }
}
