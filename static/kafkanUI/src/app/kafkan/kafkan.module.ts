import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'angular2-highcharts';
import 'rxjs/Rx';
import { ErrorComponent } from '../error/error.component';
import { LoaderComponent } from '../loader/loader.component';
import { EnvironmentListComponent } from './environment-list/environment-list.component';
import { KafkanComponent } from './kafkan.component';
import { LeftHandPanelComponent } from './left-hand-panel/left-hand-panel-component';
import { PartitionDetailComponent } from './partition-detail/partition-detail.component';
import { PartitionComponent } from './partition/partition.component';
import { KafkanBroadcast } from './service/kafkan.broadcast';
import { KafkanConstants } from './service/kafkan.constants';
import { KafkanServer } from './service/kafkan.server';
import { KafkanState } from './service/kafkan.state';
import { TopicFilterComponent } from './topic-filter/topic-filter-component';
import { KafkanWorkspaceComponent } from './workspace/workspace.component';
import { ConsumerListComponent } from './consumer-list/consumer-list.component';

@NgModule({
    declarations: [
        ConsumerListComponent,
        EnvironmentListComponent,
        ErrorComponent,
        PartitionComponent,
        PartitionDetailComponent,
        LoaderComponent,
        KafkanComponent,
        KafkanWorkspaceComponent,
        TopicFilterComponent,
        LeftHandPanelComponent,
    ],
    imports: [
        BrowserModule,
        ChartModule.forRoot(require('highcharts'),
                            require('highcharts/highcharts-3d')),
        FormsModule,
        RouterModule,
    ],
    providers: [
        KafkanConstants,
        KafkanServer,
        KafkanState,
        KafkanBroadcast,
    ],
})
export class KafkanModule { }
