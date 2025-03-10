import { Request, Response, NextFunction } from 'express'
import {
  CreateRateLimiterInput,
  CreateRateLimiterOutput,
  Store
} from './Types'
import {
  DEFAULT_CONFIG,
  ERRORS,
  STORE_ENUM
} from './Constants'
import InMemoryStore from './InMemoryStore'
import RedisStore from './RedisStore'
import CustomError from './Helpers/CustomError'

export function createRateLimiter (customConfig: CreateRateLimiterInput): CreateRateLimiterOutput {
  const config = { ...DEFAULT_CONFIG, ...customConfig }
  _validateConfig(config)

  let memoryStore: Store

  switch (config.store) {
    case STORE_ENUM.IN_MEMORY: {
      const inMemoryStoreConfig = { prefix: config.prefix }
      memoryStore = new InMemoryStore(inMemoryStoreConfig)

      setTimeout(() => {
        if ((memoryStore.clearAll != null) && typeof memoryStore.clearAll === 'function') {
          memoryStore.clearAll()
        }
      }, config.timeFrameInMs)

      break
    }

    case STORE_ENUM.REDIS: {
      if (config.redisConnectionConfig === undefined) {
        throw new CustomError(ERRORS.INVALID_MEMORY_STORE)
      }

      const redisStoreConfig = {
        connectionConfig: config.redisConnectionConfig,
        prefix: config.prefix,
        ttlInMS: config.timeFrameInMs
      }

      memoryStore = new RedisStore(redisStoreConfig)
      break
    }

    default: throw new CustomError(ERRORS.INVALID_MEMORY_STORE)
  }

  return async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const {
      clientIdentifierHeader,
      clientIdentifierExtracter,
      maxHits,
      statusCode,
      message
    } = config

    let clientIdentifier = ''
    if (typeof clientIdentifierHeader === 'string' && clientIdentifierHeader !== '') {
      clientIdentifier = request.header(clientIdentifierHeader) ?? ''
    } else if ((clientIdentifierExtracter != null) && typeof clientIdentifierExtracter === 'function') {
      clientIdentifier = await clientIdentifierExtracter(request, response, next)
    } else {
      const xForwardedFor = typeof request.headers['x-forwarded-for'] === 'string' ? request.headers['x-forwarded-for'] : ''
      clientIdentifier = xForwardedFor || request.socket.remoteAddress || ''
    }

    const shouldAllow = await memoryStore.shouldAllow(clientIdentifier, maxHits)
    if (!shouldAllow) {
      response.status(statusCode)
      return response.send(message).end()
    } else {
      process.nextTick(next)
    }
  }
}

function _validateConfig (config: CreateRateLimiterInput) {
  const { clientIdentifierHeader, clientIdentifierExtracter } = config
  if (
    (typeof clientIdentifierHeader !== 'string' || clientIdentifierHeader === '') &&
    (typeof clientIdentifierExtracter === 'function' || clientIdentifierExtracter === null)) {
    throw new CustomError(ERRORS.INVALID_CONFIG)
  }
}
