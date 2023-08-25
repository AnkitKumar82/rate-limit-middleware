import { ErrorConstants } from './Types';
export declare const STORE_ENUM: {
    IN_MEMORY: string;
    REDIS: string;
};
export declare const DEFAULT_CONFIG: {
    timeFrameInMs: number;
    maxHits: number;
    message: string;
    statusCode: number;
    store: string;
};
export declare const ERRORS: ErrorConstants;
