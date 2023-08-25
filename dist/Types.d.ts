import { Request, Response, NextFunction } from 'express';
export interface CreateRateLimiterInput {
    /**
     * Time window in milliseconds
     *
     * Default: ``10000ms = 10secs``
     */
    timeFrameInMs?: number;
    /**
     * Maximum number of requests allowed within the time window
     *
     * Default: `10`
     *
     */
    maxHits?: number;
    /**
     * Identifier Header for the client
     *
     * `clientIdentifierHeader` or `clientIdentifierExtracter` must be provided
     */
    clientIdentifierHeader?: string;
    /**
     * Extract custom identifiers for clients
     *
     * `clientIdentifierHeader` or `clientIdentifierExtracter` must be provided
     */
    clientIdentifierExtracter?: (req: Request, res: Response, next: NextFunction) => Promise<string>;
    /**
     * Response body if limit is exceeded
     *
     * Default: `Too Many Requests`
     */
    message?: string;
    /**
     * Status Code if limit is exceeded
     *
     * Default: `429`
     */
    statusCode?: number;
    /**
     * Store to be used to store the data
     *
     * Default: `IN_MEMORY`
     *
     * Allowed: 'IN_MEMORY', 'REDIS'
    */
    store?: string;
}
export type CreateRateLimiterOutput = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export interface CustomError extends Error {
    status?: number;
}
export interface ErrorConstants {
    [key: string]: CustomError;
}
export interface Store {
    shouldAllow: (key: string, maxHits: number) => Promise<boolean>;
    clearAll: () => Promise<void>;
}
