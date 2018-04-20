// REFACTOR: THIS CLASS IS ASSUMING MANY RESPONSIBILITIES

import * as bunyan from 'bunyan';
import * as q from 'q';
import * as rp from 'request-promise';
import { inspect } from 'util';
import { IConfig } from '../model/IConfig';
import { IKafkan } from '../model/IKafkan';
import { ILogger } from '../model/ILogger';
import { IPartition } from '../model/IPartition';
import { IPartitionAggregateDetail } from '../model/IPartitionAggregateDetail';
import { IReplica } from '../model/IReplica';
import { Cache } from './Cache.Class';
import { Logger } from './Logger.Class';
import { Proxy } from './Proxy.Class';

const TOPICS = 'topics';
const PARTITIONS = 'partitions';
const ENVIRONMENTS_CACHE_NAME = 'environments';

export class Kafkan implements IKafkan {
    private configParams: IConfig;
    private logger: ILogger;
    private cache: Cache;
    private proxy: Proxy;

    constructor(params: IConfig, logger: ILogger) {
        this.configParams = params;
        this.logger = logger;
        this.cache = new Cache(logger);
        this.proxy = new Proxy(params, logger);
    }

    public async getEnvironments(): Promise<string[] | null> {
        this.logger.info(`getting environments from topic names...`);
        let environments = this.cache.getItem(ENVIRONMENTS_CACHE_NAME);
        if (environments) {
            this.logger.info('Getting environments from cache.');
            return q.resolve(environments);
        } else {
            try {
                let topics = await this.getTopics();
                return this.createEnvironmentsFromTopics(JSON.parse(topics));
            } catch {
                return null;
            }
        }
    }

    public async getOutOfSyncReplicas(done: (err: any, data: IPartitionAggregateDetail[] | null) => void): Promise<void> {
        let partitionsAggregateDetail: IPartitionAggregateDetail[] = [];
        let rawTopics: string = await this.getTopics(); // parsed results from getTopics() will be a string array.  See getMatchingTopics() for an example.
        let topics: string[];
        if (rawTopics) {
            topics = JSON.parse(rawTopics);
            let promises = topics.map((topic) => this.getAllMatchingPartitionData(topic, this.logger));
            this.logger.info(`getOutOfSyncReplicas() got ${promises.length} promises`);
            q.allSettled(promises)
                .then((results) => {
                    results.forEach((element: any) => {
                        if (element.aggregate && element.aggregate.outOfSync && element.aggregate.outOfSync > 0) {
                            partitionsAggregateDetail.push(element.value);
                        }
                    });
                })
                .then(() => {
                    done(null, partitionsAggregateDetail);
                })
                .catch((err) => {
                    done(err, null);
                });
        } else {
            done('No topics returned', null);
        }
    }

    public async getPartitions(environment: string, subcategory: string, done: (err: any, data: IPartitionAggregateDetail[] | null) => void): Promise<void> {
        let partitionsAggregateDetail: IPartitionAggregateDetail[] = [];
        let topics: string[] = await this.getMatchingTopics(environment, subcategory);
        if (topics) {
            this.logger.info(`getPartitions() got these topics from getMatchingTopics(): ${topics}`);
            let promises = topics.map((topic) => this.getAllMatchingPartitionData(topic, this.logger));
            this.logger.info(`getPartitions() got ${promises.length} promises`);
            q.allSettled(promises)
                .then((results) => {
                    results.forEach((element: any) => {
                        partitionsAggregateDetail.push(element.value);
                    });
                })
                .then(() => {
                    done(null, partitionsAggregateDetail);
                })
                .catch((err) => {
                    done(err, null);
                });
        } else {
            done('No topics match query', null);
        }
    }

    public async getPartitionAggregate(topic: string): Promise<IPartitionAggregateDetail> {
        // this.logger.info(`Getting aggregate partition data for ${topic}.`);
        let url = `${TOPICS}/${topic}/${PARTITIONS}`;
        let detail = await this.proxy.pipeFromProxy(url);
        if (!detail) {
            throw new Error(`getPartitionAggregate() found no detail data for ${topic}`);
        } else {
            let parsedDetail = JSON.parse(detail);
            let aggregateAndDetail = this.aggregatePartitionDetail(parsedDetail, topic);
            //   this.logger.info('Crunched numbers on partitions', { aggregateAndDetail });
            return aggregateAndDetail;
        }
    }

    private getAllMatchingPartitionData(topic: string, logger: ILogger) {
        logger.info(`Trying to getAllMatchingPartitionData() for ${topic}`);
        let deferred = q.defer();
        q.fcall(() => {
            // TODO: THROW IN A LOGGER HERE.
            this.getPartitionAggregate(topic)
                .then((data) => {
                    logger.info(`This is the data returned for ${topic}: ${JSON.stringify(data)}`);
                    deferred.resolve(data);
                })
                .catch((err) => {
                    logger.info(`This is the error returned for ${topic}: ${err}`);
                    deferred.reject(err);
                });
        });
        return deferred.promise;
    }

    private aggregatePartitionDetail(detail: IPartition[], topicName: string) {
        let aggregateDetail: IPartitionAggregateDetail;
        let replicas = 0;
        let synched = 0;
        let unsynched = 0;
        detail.forEach((p, idx) => {
            p.replicas.forEach((r) => {
                replicas++;
                r.in_sync ? synched++ : unsynched++;
            });
        });
        this.logger.info('Replicas', { replicas });
        let aggregate = {
            inSync: synched,
            outOfSync: unsynched,
            partitions: detail && detail.length ? detail.length : 0,
            replicas,
        };
        aggregateDetail = {
            aggregate,
            detail,
            topicName,
        };
        return aggregateDetail;
    }

    private async getMatchingTopics(environment: string, subcategory: string): Promise<string[]> {
        let allTopics: string = await this.getTopics();
        this.logger.info(`getTopics() will return these topics: ${allTopics}`);
        this.logger.info(`getMatchingTopics() is looking for these patterns: ${environment}  & ${subcategory}`);
        let allTopicsParsed: string[] = JSON.parse(allTopics);
        let matchingTopics = allTopicsParsed.filter((x) => x.toUpperCase().indexOf(environment.toUpperCase()) === 0 && x.toUpperCase().indexOf(subcategory.toUpperCase()) > 0);
        this.logger.info(`getMatchingTopics() will return these topics: ${matchingTopics}`);
        return matchingTopics;
    }

    private createEnvironmentsFromTopics(topics: string[]): string[] | null {
        this.logger.info(`Creating unique environments from topics.`);
        if (topics && topics.length) {
            let environmentsWithDuplicates = topics.map<string>((val: string) => this.getTopicPrefix(val));
            let environmentsRaw = this.dedupeCategories(environmentsWithDuplicates);
            let environments = this.deleteIgnoredTopics(environmentsRaw);
            this.cache.addItem(ENVIRONMENTS_CACHE_NAME, environments);
            this.logger.info(`Adding these environments to cache: ${JSON.stringify(environments)}`);
            return environments;
        }
        return null;
    }

    private dedupeCategories(categories: string[]): string[] | null {
        if (categories && categories.length) {
            this.logger.info(`de-duplicating categories...`);
            return categories.filter((val: string, index: number, vals: string[]) => (vals.indexOf(val) === index));  // de-dupe the array.
        }
        return null;
    }
    private async getTopics(): Promise<any> {
        this.logger.info('Getting all topics.');
        let topics = await this.cache.getItem(TOPICS);
        if (topics) {
            return topics;
        } else {
            let url = `${TOPICS}`;
            return this.proxy.pipeFromProxy(url, TOPICS);
        }
    }
    private getTopicPrefix(topic: string): string | null {
        let topicPieces: string[] = topic.split('.');
        if (topicPieces && topicPieces.length) {
            return topicPieces[0]; // return the string fragment before the first '.'
        }
        return null;
    }

    private deleteIgnoredTopics(topics: string[]): string[] {
        if (topics && topics.length && this.configParams.ignoreTopics && this.configParams.ignoreTopics.length) {
            let sortedTopics = topics.sort(this.sortArrayAscending);
            let sortedIgnoredTopics = this.configParams.ignoreTopics.sort(this.sortArrayAscending);
            let winnowedTopics: string[];
            for (let i = sortedIgnoredTopics.length; i >= 0; i--) {
                winnowedTopics = sortedTopics.filter((val: string) => sortedIgnoredTopics.indexOf(val) === -1);
            }
            return winnowedTopics;
        }
        return topics;
    }

    private sortArrayAscending(a: string, b: string) {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    }
}
