import { Component, OnInit } from '@angular/core';
import { IPartition } from '../../model/IPartition';
import { IPartitionAggregateDetail } from '../../model/IPartitionAggregateDetail';
import { IReplica } from '../../model/IReplica';

@Component({
    inputs: ['topic'],
    moduleId: module.id,
    selector: 'partition-detail',
    templateUrl: 'partition-detail.component.html',
})
export class PartitionDetailComponent {
    public topic: IPartitionAggregateDetail;
    public partitions: IPartition[];

    private ngOnInit() {
        this.partitions = this.topic.detail;
    }
}
