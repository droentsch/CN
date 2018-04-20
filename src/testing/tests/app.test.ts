import * as chai from 'chai';
import chaiHttp = require('chai-http'); // This is an unusual module resolution strategy, but it's the one that works for this library.
import * as http from 'http';
import 'mocha';
import { Application } from '../../app';
import { Routing } from '../../lib/Routing.Class';
import { IKafkan } from '../../model/IKafkan';
import { ILogger } from '../../model/ILogger';
import { MockKafkan } from '../model/Mock.Kafkan.Class';
import { NoopLogger } from '../model/NoopLogger.Class';

describe('The application server', () => {
    let app: Application;
    let appServer: http.Server;
    let logger: ILogger;
    let routing: Routing;

    before ((done) => {
        app = new Application();
        logger = new NoopLogger();
        app.boot(logger).then((theLogger) => {
            const kafkan = new MockKafkan(app.ConfigParams, logger);
            routing = new Routing(app.ConfigParams, app.app, logger, kafkan);
            app.createServer(theLogger, routing)
                .then((server) => {
                    appServer = server;
                })
                .catch((err) => {
                    done(err);
                });
            done();
        });
    });
    after ((done) => {
        if (appServer.listening) {
            appServer.close(() => {
                setTimeout( process.exit, 2000 );
            });
        }
        done();
    });
    it ('Must read the configuration file', () => {
        chai.expect(app.ConfigParams).to.have.property('version');
    });
    it('Must listen for connections', () => {
        chai.expect(appServer).to.have.property('listening');
    });
    it('Must set up routing', () => {
        /* tslint:disable */
        chai.expect(routing.isRoutingSet).to.be.true;
        /* tslint:enable */
    });
    it('Must set up middleware', () => {
        /* tslint:disable */
        chai.expect(routing.isMiddlewareSet).to.be.true;
        /* tslint:enable */
    });
});
