import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'angular2-highcharts';
import 'rxjs/Rx';
import { AppComponent } from './app.component';
import { KafkanComponent } from './kafkan/kafkan.component';
import { KafkanModule } from './kafkan/kafkan.module';
import { LoaderComponent } from './loader/loader.component';

const APP_ROUTES: Routes = [
    { path: 'home', component: KafkanComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        ChartModule.forRoot(require('highcharts'),
                            require('highcharts/highcharts-3d')),
        FormsModule,
        RouterModule.forRoot(APP_ROUTES),
        HttpClientModule,
        KafkanModule,
    ],
    providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
})
export class AppModule { }
