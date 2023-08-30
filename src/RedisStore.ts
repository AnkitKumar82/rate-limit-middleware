import { createClient } from 'redis'
import {
  Store,
  RedisConnectionConfig
} from './Types'

interface RedisStore {
  client: any
  prefix: string
}

interface StoreConfig {
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

    this.shouldAllow = this.shouldAllow.bind(this)
    this.clearAll = this.clearAll.bind(this)
    this._getPrefixedKey = this._getPrefixedKey.bind(this)
  }

  async shouldAllow (key: string, maxHits: number): Promise<boolean> {
    return true
  }

  _getPrefixedKey (key: string): string {
    const prefixedKey = `${this.prefix}::${key}`
    return prefixedKey
  }

  async clearAll () {
  }
}

export default RedisStore
