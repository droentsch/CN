import { Component, OnInit } from '@angular/core';
import { IPartitionAggregateDetail } from '../../model/IPartitionAggregateDetail';
import { KafkanBroadcast } from '../service/kafkan.broadcast';

const STANDARD_ERROR = 'No partitions, or else all replicas are in sync.';

@Component({
    selector: 'workspace',
    templateUrl: 'workspace.component.html',
})

export class KafkanWorkspaceComponent implements OnInit {
    public hasTopicCollection: boolean;
    public topics: IPartitionAggregateDetail[];
    public yAxisMax: number;
    public showError: boolean;
    public errorMessage: string;
    private broadcaster: KafkanBroadcast;

    constructor(broadcaster: KafkanBroadcast ) {
        this.broadcaster = broadcaster;
        this.showError = false;
    }

    public ngOnInit() {
        this.registerBroadcastHandlers();
    }

    private registerBroadcastHandlers() {
        this.broadcaster.onNewPartitionData()
            .subscribe(
            (data) => this.extractData(data),
            (err) => this.handleError(err),
            () => this.broadcaster.loadingData(false));
    }

    private extractData(data: IPartitionAggregateDetail[]) {
        this.broadcaster.loadingData(false);
        if (!data.length) {
            this.showError = true;
            this.errorMessage = STANDARD_ERROR;
        } else {
            this.showError = false;
        }
        this.hasTopicCollection = true;
        this.topics = data;
        this.yAxisMax = this.getYAxisMax(data);
        console.info(`workspace gets this data from broadcast: ${JSON.stringify(data)}`);
    }

    private getYAxisMax(data: IPartitionAggregateDetail[]): number {
        let currentMax = 0;
        data.forEach((value) => {
            let tempMax = value.aggregate.replicas > value.aggregate.partitions ? value.aggregate.replicas : value.aggregate.partitions;
            currentMax = tempMax > currentMax ? tempMax : currentMax;
        });
        return currentMax;
    }
    private handleError(err: string) {
        // TODO: SHOW THIS ERROR TO USER
        this.broadcaster.loadingData(false);
        this.hasTopicCollection = false;
        console.info(err);
    }
}
