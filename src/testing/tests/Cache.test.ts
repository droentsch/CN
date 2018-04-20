import * as chai from 'chai';
import chaiHttp = require('chai-http'); // This is an unusual module resolution strategy, but it's the one that works for this library.
import * as http from 'http';
import 'mocha';
import { Application } from '../../app';
import { Cache } from '../../lib/Cache.Class';
import { Routing } from '../../lib/Routing.Class';
import { ILogger } from '../../model/ILogger';
import { NoopLogger } from '../model/NoopLogger.Class';

import { MockKafkan } from '../model/Mock.Kafkan.Class';

describe('The Cache class', () => {
    let app: Application;
    let appServer: http.Server;
    let logger: ILogger;
    let routing: Routing;

    before ((done) => {
        chai.use(chaiHttp);
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
            appServer.close();
        }
        done();
    });
    it('Should permit items to be added to it', (done) => {
        let cache = new Cache(logger);
        let itemSize = cache.addItem('TestTopics', ['dev2.charlottes.web', 'qalive.huckleberry.finn']);
        chai.expect(itemSize).to.be.greaterThan(0);
        done();
    });
    it('Should permit items to be read from it', (done) => {
        let cache = new Cache(logger);
        cache.addItem('TestTopics', ['dev2.charlottes.web', 'qalive.huckleberry.finn']);
        let item = cache.getItem('TestTopics');
        chai.expect(item.length).to.equal(2);
        done();
    });
});
