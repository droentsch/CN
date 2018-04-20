import { Injectable } from '@angular/core';
@Injectable()
export class KafkanConstants {
    public get PARTITIONS() {
        return 'partitions';
    }
}
