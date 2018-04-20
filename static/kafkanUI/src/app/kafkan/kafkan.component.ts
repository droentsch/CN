import { AsyncPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDescribeTopic } from '../model/IDescribeTopic';
import { IPartitionAggregate } from '../model/IPartitionAggregate';
import { KafkanBroadcast } from './service/kafkan.broadcast';
import { KafkanConstants } from './service/kafkan.constants';
import { KafkanServer } from './service/kafkan.server';
import { KafkanState } from './service/kafkan.state';

@Component({
    moduleId: module.id,
    styleUrls: ['kafkan-component.css'],
    templateUrl: 'kafkan-component.html',
})
export class KafkanComponent implements OnInit {
    public type: string;
    public topic: string;
    public hasError: boolean;
    public categories: string[];
    public showPartitions: boolean;
    public showTopicCategories: boolean;
    public currentError: string;
    public currentTopic: string;
    public showLoader: boolean;
    public topicInfo: IDescribeTopic;
    private state: KafkanState;
    private server: KafkanServer;
    private constants: KafkanConstants;
    private broadcaster: KafkanBroadcast;

    constructor(state: KafkanState, server: KafkanServer, constants: KafkanConstants, broadcast: KafkanBroadcast) {
        this.hasError = false;
        this.showTopicCategories = false;
        this.showLoader = false;
        this.state = state;
        this.server = server;
        this.constants = constants;
        this.broadcaster = broadcast;
    }
    public ngOnInit(): void {
        this.registerBroadcastHandlers();
    }
    public hideLoader(): void {
        this.showLoader = false;
    }
    private registerBroadcastHandlers() {
        this.broadcaster.onLoadingData()
            .subscribe((data) => this.showLoader = data);
    }
}
