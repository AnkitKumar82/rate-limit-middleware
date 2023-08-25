"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRORS = exports.DEFAULT_CONFIG = exports.STORE_ENUM = void 0;
exports.STORE_ENUM = {
    IN_MEMORY: 'IN_MEMORY',
    REDIS: 'REDIS'
};
exports.DEFAULT_CONFIG = {
    timeFrameInMs: 10000,
    maxHits: 10,
    message: 'Too Many Requests',
    statusCode: 429,
    store: exports.STORE_ENUM.IN_MEMORY
};
exports.ERRORS = {
    INVALID_CONFIG: {
        name: 'RL::INVALID_CONFIG',
        message: 'Invalid config'
    },
    INVALID_MEMORY_STORE: {
        name: 'RL::INVALID_MEMORY_STORE',
        message: 'Invalid Memory Store'
    }
};
