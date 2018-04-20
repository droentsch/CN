export interface IReplica {
    broker: number;
    in_sync: boolean;
    leader: boolean;
}
