import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IPartitionAggregateDetail } from '../../model/IPartitionAggregateDetail';

@Component({
    inputs: ['topic', 'yAxisMax'],
    moduleId: module.id,
    selector: 'partition',
    styles: [`
      chart {
        display: block;
      }
    `],
    templateUrl: 'partition.component.html',
})
export class PartitionComponent implements OnInit {
    public options: any;
    public topic: IPartitionAggregateDetail;
    public series: any;
    public yAxisMax: number;

    public ngOnInit() {
        this.buildChartOptions(this.topic);
    }

    private buildChartOptions(topic: IPartitionAggregateDetail) {
        this.options = {
            chart: {
                height: 500,
                margin: 75,
                options3d: {
                    alpha: 15,
                    beta: 15,
                    depth: 50,
                    enabled: true,
                },
                type: 'column',
                width: 800,
            },
            legend: {
                title: {
                    text: topic.topicName,
                },
            },
            plotOptions: {
                column: {
                    depth: 25,
                },
            },
            series: [{
                data: [
                    {name: 'Partitions', y: topic.aggregate.partitions, color: '#99ccff'},
                    {name: 'Replicas', y: topic.aggregate.replicas, color: '#99ccff'},
                    {name: 'In Synch', y: topic.aggregate.inSync, color: '#99ccff'},
                    {name: 'Out of Synch', y: topic.aggregate.outOfSync, color: '#FF0000'},
                ],
                showInLegend: false,
            }],
            title: {
                text: 'ISRs',
            },
            xAxis: {
                categories: ['Partitions', 'Replicas', 'In Sync', 'Out of Sync'],
            },
            yAxis: {
                max: this.yAxisMax,
            },
        };
    }
}
