export interface IConfig {
    version?: string;
    ignoreTopics?: string[];
    zookeeper?: string;
    brokerhost?: string;
    port?: string;
    consumerGroups?: string[];
    log?: { folder: string; stream: string; level: string };
}
