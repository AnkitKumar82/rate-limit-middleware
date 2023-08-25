import {
  Store
} from './Types'

interface InMemoryStore {
  dataStore?: Map<string, number>
}

class InMemoryStore implements Store {
  constructor () {
    this.dataStore = new Map<string, number>()

    this.shouldAllow = this.shouldAllow.bind(this)
    this.clearAll = this.clearAll.bind(this)
    this._getPrefixedKey = this._getPrefixedKey.bind(this)
  }

  async shouldAllow (key: string, maxHits: number): Promise<boolean> {
    const prefixedKey = this._getPrefixedKey(key)
    const currHits = this.dataStore?.get(prefixedKey)

    if (!currHits) {
      this.dataStore?.set(prefixedKey, 1)
      return true
    }

    if (currHits > maxHits) return false

    this.dataStore?.set(prefixedKey, currHits + 1)
    return true
  }

  _getPrefixedKey (key: string): string {
    const prefixedKey = `rate_limit_${key}`
    return prefixedKey
  }

  async clearAll () {
    this.dataStore?.clear()
  }
}

export default InMemoryStore
