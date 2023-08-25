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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = void 0;
const Constants_1 = require("./Constants");
const InMemoryStore_1 = __importDefault(require("./InMemoryStore"));
function createRateLimiter(customConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = Object.assign(Object.assign({}, Constants_1.DEFAULT_CONFIG), customConfig);
        _validateConfig(config);
        let memoryStore;
        switch (config.store) {
            case Constants_1.STORE_ENUM.IN_MEMORY: {
                memoryStore = new InMemoryStore_1.default();
                setTimeout(() => {
                    memoryStore.clearAll();
                }, config.timeFrameInMs);
                break;
            }
            case Constants_1.STORE_ENUM.REDIS: {
                // TODO: add redis store
                break;
            }
            default: throw Constants_1.ERRORS.INVALID_MEMORY_STORE;
        }
        return (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { clientIdentifierHeader, clientIdentifierExtracter, maxHits, statusCode, message } = config;
            let clientIdentifier = '';
            if (typeof clientIdentifierHeader === 'string' && clientIdentifierHeader !== '') {
                clientIdentifier = (_a = request.header(clientIdentifierHeader)) !== null && _a !== void 0 ? _a : '';
            }
            else if ((clientIdentifierExtracter != null) && typeof clientIdentifierExtracter === 'function') {
                clientIdentifier = yield clientIdentifierExtracter(request, response, next);
            }
            const shouldAllow = yield memoryStore.shouldAllow(clientIdentifier, maxHits);
            if (!shouldAllow) {
                response.status(statusCode);
                return response.send(message).end();
            }
            else {
                process.nextTick(next);
            }
        });
    });
}
exports.createRateLimiter = createRateLimiter;
function _validateConfig(config) {
    const { clientIdentifierHeader, clientIdentifierExtracter } = config;
    if ((typeof clientIdentifierHeader !== 'string' || clientIdentifierHeader === '') &&
        (typeof clientIdentifierExtracter === 'function' || clientIdentifierExtracter === null)) {
        throw Constants_1.ERRORS.INVALID_CONFIG;
    }
}
