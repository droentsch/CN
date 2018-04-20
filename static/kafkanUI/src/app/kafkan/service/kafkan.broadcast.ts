import { Inject, Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IPartitionAggregateDetail } from '../../model/IPartitionAggregateDetail';

@Injectable()
export class KafkanBroadcast {
    private partitionData$: Subject<IPartitionAggregateDetail[]>;
    private loadingData$: Subject<boolean>;

    constructor() {
        this.partitionData$ = new Subject<IPartitionAggregateDetail[]>();
        this.loadingData$ = new Subject<boolean>();
    }

    public partitionData(data: IPartitionAggregateDetail[]): void {
        this.partitionData$.next(data);
    }
    public loadingData(data: boolean): void {
        this.loadingData$.next(data);
    }
    public onNewPartitionData(): Observable<IPartitionAggregateDetail[]> {
        return this.partitionData$.asObservable()
            .map((data) => data);
    }
    public onLoadingData(): Observable<boolean> {
        return this.loadingData$.asObservable()
            .map((data) => data);
    }
}
