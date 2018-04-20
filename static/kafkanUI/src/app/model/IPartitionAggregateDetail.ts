import { IPartition } from './IPartition';
import { IPartitionAggregate } from './IPartitionAggregate';

export interface IPartitionAggregateDetail {
    topicName: string;
    aggregate: IPartitionAggregate;
    detail: IPartition[];
}
