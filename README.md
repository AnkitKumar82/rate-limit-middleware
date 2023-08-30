# Rate Limit Middleware
Rate Limiting Middleware for Express

## Installation
```shell
$ npm install --save @k_ankit/rate-limit-middleware
```

## Usage

### Basic Example

The below code uses `IN_MEMORY` store. (Redis Store [WIP])

```typescript
import { createRateLimiter } from '@k_ankit/rate-limit-middleware'
import Express from 'express'

const config = {
  timeFrameInMs: 10000,
  maxHits: 10,
  clientIdentifierHeader: 'token'
}

const rateLimiter = await createRateLimiter(config)

const TestRouter = new Express.Router()
TestRouter.get('/test', rateLimiter)
```