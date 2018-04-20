import { Inject, Injectable } from '@angular/core';
import { KafkanServer } from './kafkan.server';

@Injectable()
export class KafkanState {
    private currentTopics: string[];
    private currentError: string;
    private okReturn: boolean;
    private server: KafkanServer;

    constructor(server: KafkanServer) {
        this.server = server;
    }
}
