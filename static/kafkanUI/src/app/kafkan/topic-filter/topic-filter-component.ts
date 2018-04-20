import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core/src/event_emitter';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IPartitionAggregateDetail } from '../../model/IPartitionAggregateDetail';
import { KafkanBroadcast } from '../service/kafkan.broadcast';
import { KafkanServer } from '../service/kafkan.server';

@Component({
    inputs: ['environment'],
    outputs: ['loading', 'loaded'],
    selector: 'topic-filter',
    templateUrl: './topic-filter-component.html',
})
export class TopicFilterComponent {
    public environment: string;
    public subCategory: string;
    public loading: EventEmitter<boolean>;
    public loaded: EventEmitter<boolean>;
    private server: KafkanServer;
    private broadcast: KafkanBroadcast;

    constructor( server: KafkanServer, broadcast: KafkanBroadcast ) {
        this.server = server;
        this.broadcast = broadcast;
    }

    public getPartitionData(subCategory: string): void {
        this.broadcast.loadingData(true);
        this.server.getPartitionData(this.environment, subCategory)
            .subscribe((data: IPartitionAggregateDetail[]) => this.handlePartitionData(data), (err) => this.handleError(err));
    }

    private handlePartitionData(data: IPartitionAggregateDetail[]): void {
        console.info(`topic-filter-component gets this data from getPartitionData(): ${data}`);
        this.broadcast.partitionData(data);
    }

    private handleError(error: string): void {
        // TODO: SHOW THE ERROR TO THE USER
        console.info(error);
    }
}
