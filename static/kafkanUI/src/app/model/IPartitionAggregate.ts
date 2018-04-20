export interface IPartitionAggregate {
    inSync: number;
    outOfSync: number;
    partitions: number;
    replicas: number;
}
