import {
  Store
} from './Types'

interface InMemoryStore {
  dataStore?: Map<string, number>
  prefix: string
}

interface StoreConfig {
  prefix: string
}

class InMemoryStore implements Store {
  constructor (config: StoreConfig) {
    this.dataStore = new Map<string, number>()
    this.prefix = config.prefix

    this.shouldAllow = this.shouldAllow.bind(this)
    this.clearAll = this.clearAll.bind(this)
    this._getPrefixedKey = this._getPrefixedKey.bind(this)
  }

  async shouldAllow (key: string, maxHits: number): Promise<boolean> {
    const prefixedKey = this._getPrefixedKey(key)
    const currHits = this.dataStore?.get(prefixedKey)

    if (!currHits || currHits === null) {
      this.dataStore?.set(prefixedKey, 1)
      return true
    }

    if (currHits > maxHits) return false

    this.dataStore?.set(prefixedKey, currHits + 1)
    return true
  }

  _getPrefixedKey (key: string): string {
    const prefixedKey = `${this.prefix}::${key}`
    return prefixedKey
  }

  async clearAll () {
    this.dataStore?.clear()
  }
}

export default InMemoryStore
