import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { KafkanBroadcast } from '../service/kafkan.broadcast';
import { KafkanConstants } from '../service/kafkan.constants';
import { KafkanServer } from '../service/kafkan.server';
import { KafkanState } from '../service/kafkan.state';

@Component({
    outputs: ['error'],
    selector: 'consumer-list',
    templateUrl: 'consumer-list.component.html',
})
export class ConsumerListComponent implements OnInit {
    public consumers: string[];
    public error: EventEmitter<boolean>;
    private currentConsumer: string;
    private state: KafkanState;
    private server: KafkanServer;
    private constants: KafkanConstants;
    private broadcast: KafkanBroadcast;

    constructor(state: KafkanState, server: KafkanServer, constants: KafkanConstants, broadcast: KafkanBroadcast) {
        this.state = state;
        this.server = server;
        this.constants = constants;
        this.broadcast = broadcast;
        this.error = new EventEmitter<boolean>();
    }
    public ngOnInit(): void {
        this.getConsumers();
    }
    public getConsumers(): void {
        this.broadcast.loadingData(true);
        this.server.getConsumers()
            .subscribe((data: string[]) => {
                this.consumers = data;
            }, (err) => {
                this.error.emit(true);
                this.broadcast.loadingData(false);
            }, () => {
                this.broadcast.loadingData(false);
            });
    }
    // public toggleCurrentEnvironment(environment: string) {
    //     if (this.currentEnvironment === environment) {
    //         this.currentEnvironment = null;
    //     } else {
    //         this.currentEnvironment = environment;
    //     }
    // }
    // public isCurrentEnvironment(environment: string) {
    //     return (environment === this.currentEnvironment);
    // }
}
