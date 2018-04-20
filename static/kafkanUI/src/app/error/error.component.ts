import { Component, EventEmitter } from '@angular/core';

@Component({
    inputs: ['message'],
    selector: 'error-msg',
    styleUrls: ['./error.component.css'],
    templateUrl: './error.component.html',
    })
export class ErrorComponent {
    public message: string;
}
