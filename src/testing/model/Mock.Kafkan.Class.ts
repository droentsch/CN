// REFACTOR: THIS CLASS IS ASSUMING MANY RESPONSIBILITIES

import * as bunyan from 'bunyan';
import * as q from 'q';
import * as rp from 'request-promise';
import { inspect } from 'util';
import { Cache } from '../../lib/Cache.Class';
import { Logger } from '../../lib/Logger.Class';
import { IConfig } from '../../model/IConfig';
import { IKafkan } from '../../model/IKafkan';
import { ILogger } from '../../model/ILogger';
import { IPartition } from '../../model/IPartition';
import { IPartitionAggregateDetail } from '../../model/IPartitionAggregateDetail';
import { IReplica } from '../../model/IReplica';

const REST_PROXY = 'http://127.0.0.1:8082';
const TOPICS = 'topics';
const PARTITIONS = 'partitions';
const ENVIRONMENTS_CACHE_NAME = 'environments';

export class MockKafkan implements IKafkan {
    private configParams: IConfig;
    private logger: ILogger;
    private cache: Cache;

    constructor(params: IConfig, logger: ILogger) {
        this.configParams = params;
        this.logger = logger;
        this.cache = new Cache(logger);
    }

    public async getEnvironments(): Promise<string[] | null> {
            let topics = await this.getTopics();
            return this.createEnvironmentsFromTopics(JSON.parse(topics));
    }

    public async getOutOfSyncReplicas(done: (err: any, data: IPartitionAggregateDetail[] | null)  => void): Promise<void> {
        let partitionsAggregateDetail: IPartitionAggregateDetail[] = [];
        let topics: string[] = await ['dev2.bobs.topic', 'demo.jims.topic', 'local.kates.topic'];
        if (topics) {
            let testData: IPartitionAggregateDetail[] = [{
                aggregate : {
                    inSync: 1,
                    outOfSync: 0,
                    partitions: 1,
                    replicas: 1,
                },
                detail : [{
                    leader : 186,
                    partition : 304,
                    replicas : [{
                        broker : 186,
                        in_sync : true,
                        leader : true,
                    }],
                }],
                topicName : 'dev2.bobs.topic',
            }];
            done(null, testData);
        }
    }

    public async getPartitions(environment: string, subcategory: string, done: (err: any, data: IPartitionAggregateDetail[] | null) => void): Promise<void> {
        let partitionsAggregateDetail: IPartitionAggregateDetail[] = [];
        let topics: string[] = await ['dev2.bobs.topic', 'demo.jims.topic', 'local.kates.topic'];
        if (topics) {
            let testData: IPartitionAggregateDetail[] = [{
                aggregate : {
                    inSync: 1,
                    outOfSync: 0,
                    partitions: 1,
                    replicas: 1,
                },
                detail : [{
                    leader : 186,
                    partition : 304,
                    replicas : [{
                        broker : 186,
                        in_sync : true,
                        leader : true,
                    }],
                }],
                topicName : 'dev2.bobs.topic',
            }];
            done(null, testData);
        }
    }

    private createEnvironmentsFromTopics(topics: string[]): string[] | null {
        return ['environment1', 'environment2'];
    }

    private async getTopics(): Promise<any> {
        this.logger.info('Getting all topics.');
        let topics = await JSON.stringify({name: 'bob', city: 'NY'});
        return topics;
    }
}
