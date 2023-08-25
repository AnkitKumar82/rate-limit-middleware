"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class InMemoryStore {
    constructor() {
        this.dataStore = new Map();
        this.shouldAllow = this.shouldAllow.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this._getPrefixedKey = this._getPrefixedKey.bind(this);
    }
    shouldAllow(key, maxHits) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const prefixedKey = this._getPrefixedKey(key);
            const currHits = (_a = this.dataStore) === null || _a === void 0 ? void 0 : _a.get(prefixedKey);
            if (!currHits) {
                (_b = this.dataStore) === null || _b === void 0 ? void 0 : _b.set(prefixedKey, 1);
                return true;
            }
            if (currHits > maxHits)
                return false;
            (_c = this.dataStore) === null || _c === void 0 ? void 0 : _c.set(prefixedKey, currHits + 1);
            return true;
        });
    }
    _getPrefixedKey(key) {
        const prefixedKey = `rate_limit_${key}`;
        return prefixedKey;
    }
    clearAll() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.dataStore) === null || _a === void 0 ? void 0 : _a.clear();
        });
    }
}
exports.default = InMemoryStore;
