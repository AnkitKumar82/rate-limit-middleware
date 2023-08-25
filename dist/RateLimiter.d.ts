import { CreateRateLimiterInput, CreateRateLimiterOutput } from './Types';
declare function createRateLimiter(customConfig: CreateRateLimiterInput): Promise<CreateRateLimiterOutput>;
export { createRateLimiter };
