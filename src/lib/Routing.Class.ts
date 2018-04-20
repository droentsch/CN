import * as bunyan from 'bunyan';
import * as express from 'express';
import * as path from 'path';
import { IConfig } from '../model/IConfig';
import { IKafkan } from '../model/IKafkan';
import { ILogger } from '../model/ILogger';
import { Kafkan } from './Kafkan.Class';
import { Logger } from './Logger.Class';

export class Routing {
    private app: express.Application;
    private config: IConfig;
    private kafkan: IKafkan;
    private logger: ILogger;
    private _isMiddlewareSet: boolean = false;
    private _isRoutingSet: boolean = false;

    public get isMiddlewareSet(): boolean {
        return this._isMiddlewareSet;
    }

    public set isMiddlewareSet(val: boolean) {
        this._isMiddlewareSet = val;
    }

    public get isRoutingSet(): boolean {
        return this._isRoutingSet;
    }

    public set isRoutingSet(val: boolean) {
        this._isRoutingSet = val;
    }

    constructor(config: IConfig, app: express.Application, logger: ILogger, kafkan: IKafkan) {
        this.app = app;
        this.config = config;
        this.logger = logger;
        this.kafkan = kafkan;
    }

    public setMiddleWare() {
        this.app.use('/app', express.static(path.join(__dirname, '../static/kafkanUI/')));
        this.isMiddlewareSet = true;
    }
    public setRoutes() {
        this.app.get('/version', (req, res) => {
            if (this.config && this.config.version && this.config.version.length > 0) {
                this.logger.info(`Returning kafkan version:  ${this.config.version}`);
                res.status(200).send(`<h1>${this.config.version}</h1>`);
            } else {
                this.logger.error("Can't return Kafkan version.");
                res.sendStatus(500);
            }
        });
        this.app.get('/environments', (req, res) => {
            this.kafkan.getEnvironments()
                .then((data) => {
                    if (data === null) {
                        res.status(500);
                        res.send('No topics available');
                    } else {
                        res.status(200);
                        res.send(data);
                    }
                })
                .catch((error) => {
                    this.logger.error(`Error caught in router: ${error}`);
                    res.status(500);
                    res.send(error);
                });
        });
        this.app.get('/consumers', (req, res) => {
            if (this.config && this.config.consumerGroups && this.config.consumerGroups.length) {
                let serial = JSON.stringify(this.config.consumerGroups);
                this.logger.info(`Returning consumer groups:  ${serial}`);
                res.status(200).send(serial);
            } else {
                this.logger.error("Can't return consumer groups.");
                res.sendStatus(500);
            }
        });
        this.app.get('/partitions/:environment/:subcategory', (req, res) => {
            this.kafkan.getPartitions(req.params.environment, req.params.subcategory, (err, data) => {
                if (err) {
                    this.logger.error(`Error caught in router: ${err}`);
                    res.send(err).status(500);
                } else {
                    this.logger.info(`This is the data received in the Routing object: ${JSON.stringify(data)}`);
                    res.send(data).status(200);
                }
            } );
        });
        this.app.get('/replicas/unsynched', (req, res) => {
            this.kafkan.getOutOfSyncReplicas((err, data) => {
                if (err) {
                    this.logger.error(`Error caught in router: ${err}`);
                    res.send(err).status(500);
                } else {
                    res.send(data).status(200);
                }
            } );
        });
        this.isRoutingSet = true;
    }
}
