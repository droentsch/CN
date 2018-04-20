import * as fs from 'fs';
import * as Q from 'q';
import { IConfig } from '../model/IConfig';

const CONFIG_FILE = './config/server-config.json';
export class Configuration {
    constructor() {
    }
    public getParams(): Q.Promise<IConfig> {
        const readFile = Q.nfbind(fs.readFile);
        return readFile(CONFIG_FILE, 'utf-8').then((data: string) => JSON.parse(data));
    }
}
