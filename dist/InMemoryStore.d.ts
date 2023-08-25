import { Store } from './Types';
interface InMemoryStore {
    dataStore?: Map<string, number>;
}
declare class InMemoryStore implements Store {
    constructor();
    shouldAllow(key: string, maxHits: number): Promise<boolean>;
    _getPrefixedKey(key: string): string;
    clearAll(): Promise<void>;
}
export default InMemoryStore;
