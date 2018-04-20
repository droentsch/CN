import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { IPartitionAggregateDetail } from '../../model/IPartitionAggregateDetail';

@Injectable()
export class KafkanServer {
    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    public getConsumers(): Observable<string[]> {
        return this.http.get<string[]>(`/consumers`);
    }
    public getKafkaEnvironments(): Observable<string[]> {
        return this.http.get<string[]>('/environments');
    }
    public getPartitionData(environment: string, subCategory: string): Observable<IPartitionAggregateDetail[]> {
        return this.http.get<IPartitionAggregateDetail[]>(`/partitions/${environment}/${subCategory}`);
    }
    public getOutOfSyncReplicas(): Observable<IPartitionAggregateDetail[]> {
        return this.http.get<IPartitionAggregateDetail[]>(`/replicas/unsynched`);
    }
}
