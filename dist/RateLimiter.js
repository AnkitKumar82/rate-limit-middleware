"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = void 0;
const Constants_1 = require("./Constants");
const InMemoryStore_1 = __importDefault(require("./InMemoryStore"));
async function createRateLimiter(customConfig) {
    const config = { ...Constants_1.DEFAULT_CONFIG, ...customConfig };
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
    return async (request, response, next) => {
        const { clientIdentifierHeader, clientIdentifierExtracter, maxHits, statusCode, message } = config;
        let clientIdentifier = '';
        if (typeof clientIdentifierHeader === 'string' && clientIdentifierHeader !== '') {
            clientIdentifier = request.header(clientIdentifierHeader) ?? '';
        }
        else if ((clientIdentifierExtracter != null) && typeof clientIdentifierExtracter === 'function') {
            clientIdentifier = await clientIdentifierExtracter(request, response, next);
        }
        const shouldAllow = await memoryStore.shouldAllow(clientIdentifier, maxHits);
        if (!shouldAllow) {
            response.status(statusCode);
            return response.send(message).end();
        }
        else {
            process.nextTick(next);
        }
    };
}
exports.createRateLimiter = createRateLimiter;
function _validateConfig(config) {
    const { clientIdentifierHeader, clientIdentifierExtracter } = config;
    if ((typeof clientIdentifierHeader !== 'string' || clientIdentifierHeader === '') &&
        (typeof clientIdentifierExtracter === 'function' || clientIdentifierExtracter === null)) {
        throw Constants_1.ERRORS.INVALID_CONFIG;
    }
}
