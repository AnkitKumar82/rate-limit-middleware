import { createClient } from 'redis'
import {
  Store,
  RedisConnectionConfig
} from './Types'

interface RedisStore {
  client: any
  prefix: string
  ttlInSecs: number
}

interface StoreConfig {
  ttlInSecs: number
  connectionConfig: RedisConnectionConfig
  prefix: string
}

class RedisStore implements Store {
  constructor (storeConfig: StoreConfig) {
    const { connectionConfig } = storeConfig

    let url = `redis://${connectionConfig.host}:${connectionConfig.port}`
    if (typeof connectionConfig.password === 'string' && connectionConfig.password !== null && connectionConfig.password) {
      url = `rediss://${connectionConfig.user}:${connectionConfig.password}@${connectionConfig.host}:${connectionConfig.port}`
    }

    this.client = createClient({ url })
    this.prefix = storeConfig.prefix
    this.ttlInSecs = storeConfig.ttlInSecs

    this.shouldAllow = this.shouldAllow.bind(this)
    this._getPrefixedKey = this._getPrefixedKey.bind(this)

    this.client.on('error', (error: any) => {
      console.log('Error Redis connection', error)
      process.exit(1)
    })
    this.client.connect()

    process.on('beforeExit', async () => {
      await this.client.quit()
    })
  }

  async shouldAllow (key: string, maxHits: number): Promise<boolean> {
    if (!this.client.isOpen) {
      await this.client.connect()
    }

    const prefixedKey = this._getPrefixedKey(key)
    const currHits = await this.client.get(prefixedKey)

    if (!currHits || currHits === null) {
      await this.client.set(prefixedKey, 1)
      await this.client.expire(prefixedKey, this.ttlInSecs)
      return true
    }

    if (currHits >= maxHits) return false
    await this.client.incr(prefixedKey)
    return true
  }

  _getPrefixedKey (key: string): string {
    const prefixedKey = `${this.prefix}::${key}`
    return prefixedKey
  }
}

export default RedisStore
