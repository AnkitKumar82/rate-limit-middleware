"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InMemoryStore {
    constructor() {
        this.dataStore = new Map();
        this.shouldAllow = this.shouldAllow.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this._getPrefixedKey = this._getPrefixedKey.bind(this);
    }
    async shouldAllow(key, maxHits) {
        const prefixedKey = this._getPrefixedKey(key);
        const currHits = this.dataStore?.get(prefixedKey);
        if (!currHits) {
            this.dataStore?.set(prefixedKey, 1);
            return true;
        }
        if (currHits > maxHits)
            return false;
        this.dataStore?.set(prefixedKey, currHits + 1);
        return true;
    }
    _getPrefixedKey(key) {
        const prefixedKey = `rate_limit_${key}`;
        return prefixedKey;
    }
    async clearAll() {
        this.dataStore?.clear();
    }
}
exports.default = InMemoryStore;
