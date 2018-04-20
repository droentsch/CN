import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { KafkanBroadcast } from '../service/kafkan.broadcast';
import { KafkanConstants } from '../service/kafkan.constants';
import { KafkanServer } from '../service/kafkan.server';
import { KafkanState } from '../service/kafkan.state';

@Component({
    outputs: ['error'],
    selector: 'environment-list',
    templateUrl: 'environment-list.component.html',
})
export class EnvironmentListComponent implements OnInit {
    public environments: string[];
    public error: EventEmitter<boolean>;
    private currentEnvironment: string;
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
        this.getEnvironments();
    }
    public getEnvironments(): void {
        this.broadcast.loadingData(true);
        this.server.getKafkaEnvironments()
            .subscribe((data: string[]) => {
                this.environments = data;
            }, (err) => {
                this.error.emit(true);
                this.broadcast.loadingData(false);
            }, () => {
                this.broadcast.loadingData(false);
            });
    }
    public toggleCurrentEnvironment(environment: string) {
        if (this.currentEnvironment === environment) {
            this.currentEnvironment = null;
        } else {
            this.currentEnvironment = environment;
        }
    }
    public isCurrentEnvironment(environment: string) {
        return (environment === this.currentEnvironment);
    }
}
