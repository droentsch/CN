import { ILogger } from '../../model/ILogger';
export class NoopLogger implements ILogger {
    constructor() {}

    public info(message: any, otherInfo?: any ): void {}
    public error(message: any, otherInfo?: any ): void {}

}
