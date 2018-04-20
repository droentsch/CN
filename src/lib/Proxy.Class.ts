import * as bunyan from 'bunyan';
import * as rp from 'request-promise';
import { Cache } from './Cache.Class';
import { IConfig } from '../model/IConfig';
import { ILogger } from '../model/ILogger';

const REST_PROXY = 'http://127.0.0.1:8082';

export class Proxy {
    private configParams: IConfig;
    private logger: ILogger;
    private cache: Cache;

    constructor(params: IConfig, logger: ILogger) {
        this.configParams = params;
        this.logger = logger;
        this.cache = new Cache(logger);
    }

    // pipeFromProxy() could be returning any JSON, hence the return type.
    public async pipeFromProxy(url: string, cacheName?: string): Promise<any> {
        this.logger.info(`Attempting this call to REST proxy: ${url}`);
        let proxyUrl = `${REST_PROXY}/${url}`;
        let data = await rp(proxyUrl);
        if (cacheName) {
            this.cache.addItem(cacheName, data);
        }
        return data;
    }
}
