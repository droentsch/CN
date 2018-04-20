import { Component} from '@angular/core';
import { IPartitionAggregateDetail } from '../../model/IPartitionAggregateDetail';
import { KafkanBroadcast } from '../service/kafkan.broadcast';
import { KafkanConstants } from '../service/kafkan.constants';
import { KafkanServer } from '../service/kafkan.server';

const NETWORK_ERROR = `Error getting topics.  Is Zookeeper reachable?`;

@Component({
    selector: 'left-hand-panel',
    templateUrl: './left-hand-panel-component.html',
})
export class LeftHandPanelComponent {
    public hasError: boolean;
    public environments: string[];
    public showEnvironmentList: boolean;
    public showConsumerList: boolean;
    public errorMessage: string;
    private currentEnvironment: string;
    private constants: KafkanConstants;
    private server: KafkanServer;
    private broadcast: KafkanBroadcast;

    constructor(constants: KafkanConstants, server: KafkanServer, broadcast: KafkanBroadcast) {
        this.hasError = false;
        this.showEnvironmentList = false;
        this.showConsumerList = false;
        this.constants = constants;
        this.server = server;
        this.broadcast = broadcast;
    }
    public toggleEnvironments() {
        this.showEnvironmentList = !this.showEnvironmentList;
    }
    public toggleConsumers() {
        this.showConsumerList = !this.showConsumerList;
    }
    public getSyncStatus() {
        this.broadcast.loadingData(true);
        this.server.getOutOfSyncReplicas()
            .subscribe((data: IPartitionAggregateDetail[]) => this.broadcast.partitionData(data), (err) => this.handleError(err));
    }
    public showError(): void {
        this.hasError = true;
        this.errorMessage = NETWORK_ERROR;
    }
    private handleError(error: string): void {
        // TODO: SHOW THE ERROR TO THE USER
        console.info(error);
    }
}
