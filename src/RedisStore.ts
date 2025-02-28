import { createClient } from 'redis'
import {
  Store,
  RedisConnectionConfig
} from './Types'

interface RedisStore {
  client: any
  prefix: string
  ttlInMS: number
  binCount: number
  binSizeInMS: number
}

interface StoreConfig {
  ttlInMS: number
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
    this.ttlInMS = storeConfig.ttlInMS
    this.binCount = 100
    this.binSizeInMS = Math.ceil(storeConfig.ttlInMS / this.binCount)

    this.shouldAllow = this.shouldAllow.bind(this)
    this._getPrefixedKey = this._getPrefixedKey.bind(this)
    this._getPrefixedBinKey = this._getPrefixedBinKey.bind(this)

    this.client.on('error', (error: any) => {
      console.log('Error Redis connection', error)
      process.exit(1)
    })
    this.client.connect()

    process.on('beforeExit', async () => {
      await this.client.quit()
    })
  }

  _getPrefixedBinKey(key: string, binId: number) {
    return `${this.prefix}::${key}::${binId}`
  }

  async shouldAllow(key: string, maxHits: number): Promise<boolean> {
    const now = Date.now()
    const currentBinId = Math.floor(now / this.binSizeInMS)    
    const oldestBinId = currentBinId - this.binCount + 1


    const prefixedBinKeys = []
    for (let i = currentBinId; i >= oldestBinId; i--) {
      prefixedBinKeys.push(this._getPrefixedBinKey(key, i))
    }

    const counts = await this.client.mGet(prefixedBinKeys)
    const tCount = counts.reduce((sum: number, count: string) => sum + (parseInt(count) || 0), 0)
    
    if(tCount >= maxHits) return false
    
    // Check if current bin is present otherwise increase count
    const currentBinCount = counts[0]
    const currentPrefixedBinKey = this._getPrefixedBinKey(key, currentBinId)
    if(!currentBinCount || currentBinCount === null) {
      await this.client.set(currentPrefixedBinKey, 1)
      await this.client.expire(currentPrefixedBinKey, Math.floor(this.ttlInMS/1000))
    } else {
      await this.client.incr(currentPrefixedBinKey)
    }

    return true
  }

  _getPrefixedKey (key: string): string {
    const prefixedKey = `${this.prefix}::${key}`
    return prefixedKey
  }
}

export default RedisStore
