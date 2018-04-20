import { IPartition } from './IPartition';

export interface IDescribeTopic {
    partitions: IPartition[];
    name: string;
}
