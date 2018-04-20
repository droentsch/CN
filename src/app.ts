import * as bunyan from 'bunyan';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as Q from 'q';
import { Configuration } from './lib/Configuration.Class';
import { Kafkan } from './lib/Kafkan.Class';
import { Logger } from './lib/Logger.Class';
import { Routing } from './lib/Routing.Class';
import { IConfig } from './model/IConfig';
import { IKafkan } from './model/IKafkan';
import { ILogger } from './model/ILogger';
import { NoopLogger } from './testing/model/NoopLogger.Class';

export class Application {
    public app: express.Application;
    public ConfigParams: IConfig;
    private logger: ILogger;
    private server: http.Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.ConfigParams = {};
    }
    public async boot(optionalLogger?: ILogger): Promise<ILogger> {
        const Config = new Configuration();
        this.ConfigParams = await Config.getParams();
        let logger: ILogger;
        if (!optionalLogger) {
            logger = new Logger(this.ConfigParams).getLogger();
        } else {
            logger = optionalLogger;
        }
        return logger;
    }
    public createServer(logger: ILogger, routing: Routing): Promise<http.Server> {
        try {
            this.logger = logger;
            this.setRouting(routing);
            this.setServer();
            return Promise.resolve(this.server);
        } catch (e) {
            logger.error(`Error creating server: ${e}`);
            return Promise.reject(e);
        }
    }
    private setRouting(routing: Routing): void {
        routing.setMiddleWare();
        routing.setRoutes();
    }
    private setServer(): void {
        this.server.listen(this.ConfigParams.port, () => {
            this.logger.info(`Kafkan server listening on port ${this.ConfigParams.port}`);
        });
    }
}

if (require.main === module) {
    const main = new Application();
    main.boot()
        .then((logger) => {
            const kafkan = new Kafkan(main.ConfigParams, logger);
            let routing = new Routing(main.ConfigParams, main.app, logger, kafkan);
            main.createServer(logger, routing);
        })
        .catch(() => {
            console.info('Error creating server');
        });
}
