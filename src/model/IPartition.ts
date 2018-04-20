import { IReplica } from './IReplica';

export interface IPartition {
    replicas: IReplica[];
    leader: number;
    partition: number;
}
