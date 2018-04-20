import {Component} from '@angular/core';

@Component({
    selector: 'kafkan-app',
    template: `
<div>
    <router-outlet></router-outlet>
</div>
`,
})
export class AppComponent {
}
