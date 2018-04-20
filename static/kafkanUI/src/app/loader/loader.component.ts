import { Component} from '@angular/core';

@Component({
    inputs: ['show'],
    moduleId: module.id,
    selector: 'loader',
    styleUrls: ['./loader.component.css'],
    template: '<div class="loader"></div>',
})
export class LoaderComponent {
    public show: boolean;
    public showLoader: boolean;
    constructor() {
        this.showLoader = true;
    }
}
