# Rate Limit Middleware
Rate Limiting Middleware for Express

## Installation
```shell
$ npm install --save @k_ankit/rate-limit-middleware
```

## Usage

### Basic Example

The below code uses `IN_MEMORY` store.

```typescript
import { createRateLimiter } from '@k_ankit/rate-limit-middleware'
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
import { createRateLimiter } from '@k_ankit/rate-limit-middleware'
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