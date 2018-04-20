export interface ILogger {
    info: ( msg: any, otherInfo?: any ) => void;
    error: ( msg: any, otherInfo?: any ) => void;
}
