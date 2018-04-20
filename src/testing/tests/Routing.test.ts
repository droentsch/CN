import * as chai from 'chai';
import chaiHttp = require('chai-http'); // This is an unusual module resolution strategy, but it's the one that works for this library.
import * as http from 'http';
import 'mocha';
import { Application } from '../../app';
import { Routing } from '../../lib/Routing.Class';
import { ILogger } from '../../model/ILogger';
import { NoopLogger } from '../model/NoopLogger.Class';

import { MockKafkan } from '../model/Mock.Kafkan.Class';

describe('The Routing class', () => {
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
    it ('Must return success on GET /version', (done) => {
        chai.request(appServer)
            .get('/version')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                done();
            });
    });
    it ('Must return success on GET /environments', (done) => {
        chai.request(appServer)
            .get('/environments')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                done();
            });
    });
    it ('Must return success on GET /partitions/*', (done) => {
        chai.request(appServer)
            .get('/partitions/dev2/assignment')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                done();
            });
    });

    it ('Must return success on GET /replicas/unsynched', (done) => {
        chai.request(appServer)
            .get('/replicas/unsynched')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                done();
            });
    });
});
