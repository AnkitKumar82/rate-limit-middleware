import { Request, Response, NextFunction } from 'express'

export interface RedisConnectionConfig {
  host: string
  port: string
  user?: string
  password?: string
}

export interface CreateRateLimiterInput {
  /**
   * Time window in milliseconds
   *
   * Default: ``10000ms = 10secs``
   */
  timeFrameInMs?: number
  /**
   * Maximum number of requests allowed within the time window
   *
   * Default: `10`
   *
   */
  maxHits?: number
  /**
   * Identifier Header for the client
   *
   * If `clientIdentifierHeader` and `clientIdentifierExtracter` are not provided Ip address is used as client identifier
   */
  clientIdentifierHeader?: string
  /**
   * Extract custom identifiers for clients
   *
   * If `clientIdentifierHeader` and `clientIdentifierExtracter` are not provided Ip address is used as client identifier
   */
  clientIdentifierExtracter?: (req: Request, res: Response, next: NextFunction) => Promise<string>
  /**
   * Response body if limit is exceeded
   *
   * Default: `Too Many Requests`
   */
  message?: string
  /**
   * Status Code if limit is exceeded
   *
   * Default: `429`
   */
  statusCode?: number
  /**
   * Prefix to append to the Client Identifier
   */
  prefix?: string
  /**
   * Store to be used to store the data
   *
   * Default: `IN_MEMORY`
   *
   * Allowed: 'IN_MEMORY', 'REDIS'
  */
  store?: string
  /**
   * Store Client Config to be used to store the data
   *
   * Must be provided if `REDIS` store is used
   *
  */
  redisConnectionConfig?: RedisConnectionConfig
}

export type CreateRateLimiterOutput = (req: Request, res: Response, next: NextFunction) => Promise<any>

export interface CustomError extends Error {
  status?: number
}

export interface ErrorConstants {
  [key: string]: CustomError
}

export interface Store {
  shouldAllow: (key: string, maxHits: number) => Promise<boolean>
  clearAll?: () => Promise<void>
}
