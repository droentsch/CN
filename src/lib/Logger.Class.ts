import * as bunyan from 'bunyan';
import { IConfig } from '../model/IConfig';

const COMMON_MODULE = 'kafkan';

export class Logger {
    private static logger: bunyan;
    private configParams: IConfig;
    constructor(params: IConfig) {
      this.configParams = params;
    }

    public getLogger(): bunyan {
        if (Logger.logger) {
          return Logger.logger;
        }
        console.info(`[${new Date()}]: Initializing logger`);

        if (this.configParams.log.stream == 'console') {
          const logLevel = this.getLogLevelFromString(this.configParams.log.level);
          Logger.logger = this.getConsoleLogger(this.configParams.log.level);
        } else {
          Logger.logger = this.getFileLogger(this.configParams.log.folder, this.configParams.log.level);
        }

        return Logger.logger;
    }

    private getLogLevelFromString(level: string): bunyan.LogLevel {
      if (level === 'trace') { return bunyan.levelFromName.trace; }
      if (level === 'debug') { return bunyan.levelFromName.debug; }
      if (level === 'info') { return bunyan.levelFromName.info; }
      if (level === 'warn') { return bunyan.levelFromName.warn; }
      if (level === 'error') { return bunyan.levelFromName.error; }
      return 0;
    }

    private getConsoleLogger(level: string) {
      return bunyan.createLogger({
        level: this.getLogLevelFromString(level),
        name: COMMON_MODULE,
        serializers: bunyan.stdSerializers,
      });
    }

    private getFileLogger(path: string, level: string) {
        return bunyan.createLogger({
          name: COMMON_MODULE,
          streams: [
            {
              count: 5,
              level: this.getLogLevelFromString(level),
              path,
              period: '1d',
              type: 'rotating-file',
            }],
        });
    }
}
