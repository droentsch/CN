import * as bunyan from 'bunyan';
import * as timers from 'timers';
import { ICache } from '../model/ICache';
import { IConfig } from '../model/IConfig';
import { ILogger } from '../model/ILogger';
import { Logger } from './Logger.Class';
let sizeof = require('sizeof');

const DELAY = 10 * 60 * 1000; // ten minutes

export class Cache {
    private static cache: any;
    private static logger: ILogger;

    constructor(logger: ILogger) {
        // Make the logger static in this class, since it will need to be called in deleteItem(), which is often
        // called on a timer.  When the timer elapses, the class instance is no longer in scope.
        Cache.logger = logger;
        if (!Cache.cache) {
            Cache.logger.info(`initializing cache`);
            Cache.cache = {};
        }
    }

    public addItem(name: string, itemToAdd: any): number {
        Cache.logger.info(`caching ${name}`);

        let timeout = this.handleTimeouts(name);
        let cacheItem: ICache = {
            item: itemToAdd,
            timeoutId: timeout,
        };
        Cache.cache[name] = cacheItem;
        let cacheSize = sizeof.sizeof(Cache.cache);
        Cache.logger.info(`adding item ${name} to cache.  Cache size is now ${cacheSize} bytes.`);

        return cacheSize;
    }

    public getItem( name: string) {
        if (!Cache.cache || !Cache.cache[name]) {
            return null;
        }
        Cache.logger.info(`getting item ${name} from cache`);
        return Cache.cache[name].item;
    }

    public deleteItem( name: string) {
        delete Cache.cache[name];
        let cacheSize = sizeof.sizeof(Cache.cache);
        Cache.logger.info(`deleted item ${name} from cache.  Cache size is now ${cacheSize} bytes.`);
    }

    private handleTimeouts(name: string): NodeJS.Timer {
        // clear the timeout set on this item, if it exists
        if ( Cache.cache[name] && Cache.cache[name].timeoutId) {
            timers.clearTimeout(Cache.cache[name].timeoutId);
        }

        // start a new timer
        let timeout = timers.setTimeout(this.deleteItem, DELAY, [name]);

        return timeout;
    }
}
