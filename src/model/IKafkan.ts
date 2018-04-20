import { IPartitionAggregateDetail } from './IPartitionAggregateDetail';

export interface IKafkan {
    getEnvironments: () => Promise<string[] | null>;
    getPartitions: (environment: string, subcategory: string, done: (err: any, data: IPartitionAggregateDetail[] | null) => void) => Promise<void>;
    getOutOfSyncReplicas: (done: (err: any, data: IPartitionAggregateDetail[] | null) => void) => Promise<void>;
}
