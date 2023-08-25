"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { REDIS_USER = '', REDIS_AUTH = '', REDIS_HOST = '', REDIS_PORT = '' } = process.env;
const CONFIG = {
    USER: REDIS_USER,
    AUTH: REDIS_AUTH,
    HOST: REDIS_HOST,
    PORT: REDIS_PORT
};
exports.default = CONFIG;
