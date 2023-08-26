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

export async function createRateLimiter (customConfig: CreateRateLimiterInput): Promise<CreateRateLimiterOutput> {
  const config = { ...DEFAULT_CONFIG, ...customConfig }
  _validateConfig(config)

  let memoryStore: Store

  switch (config.store) {
    case STORE_ENUM.IN_MEMORY: {
      memoryStore = new InMemoryStore()

      setTimeout(() => {
        memoryStore.clearAll()
      }, config.timeFrameInMs)

      break
    }

    case STORE_ENUM.REDIS: {
      // TODO: add redis store
      break
    }

    default: throw ERRORS.INVALID_MEMORY_STORE
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
    throw ERRORS.INVALID_CONFIG
  }
}
