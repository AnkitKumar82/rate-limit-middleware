# Rate Limit Middleware
Rate Limiting Middleware for Express

## Installation
```shell
$ npm install --save @k_ankit/rate-limiter
```

## Config
| Field                     | Type       | Default           | Description                                                                                 |
| :------------------------ | :--------- | :---------------- | :------------------------------------------------------------------------------------------ |
| timeFrameInMs             | `Number`   | 10000             | Time window in milliseconds                                                                 |
| maxHits                   | `Number`   | 10                | Maximum number of requests allowed within the time window                                   |
| clientIdentifierHeader    | `String`   |                   | Identifier Header for the client                                                            |
| clientIdentifierExtracter | `Function` |                   | Extract custom identifiers for clients                                                      |
| message                   | `String`   | Too Many Requests | Response body if limit is exceeded                                                          |
| statusCode                | `Number`   | 429               | Status Code if limit is exceeded                                                            |
| prefix                    | `String`   |                   | Prefix to append to the Client Identifier                                                   |
| store                     | `String`   | IN_MEMORY         | Store to be used to store the data, Allowed: 'IN_MEMORY', 'REDIS'                           |
| redisConnectionConfig     | `Object`   |                   | Store Client Config to be used to store the data, Must be provided if `REDIS` store is used |

Note: If `clientIdentifierHeader` and `clientIdentifierExtracter` are not provided Ip address is used as client identifier

## Usage

### Basic Example

The below code uses `IN_MEMORY` store.

```typescript
import { createRateLimiter } from '@k_ankit/rate-limiter'
import Express from 'express'

const config = {
  timeFrameInMs: 10000,
  maxHits: 10,
  clientIdentifierHeader: 'x-token'
}

const rateLimiter = await createRateLimiter(config)

const TestRouter = new Express.Router()
TestRouter.get('/test', rateLimiter)
```

The below code uses `REDIS` store.

```typescript
import { createRateLimiter } from '@k_ankit/rate-limiter'
import Express from 'express'

const config = {
  timeFrameInMs: 10000,
  maxHits: 10,
  clientIdentifierHeader: 'x-token',
  store: 'REDIS',
  redisConnectionConfig: {
    host: 'sample.redis.server',
    port: '6379',
    user: 'your_user_here',
    password: 'your_password_here'
  }
}

const rateLimiter = await createRateLimiter(config)

const TestRouter = new Express.Router()
TestRouter.get('/test', rateLimiter)
```