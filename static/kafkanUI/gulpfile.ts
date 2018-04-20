import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as runSequence from 'run-sequence';
import * as flatten from 'gulp-flatten';
import * as concat from 'gulp-concat';
import * as replace from 'gulp-replace';
import * as del from 'del';
import * as path from 'path';
import tslint from 'gulp-tslint';
import TaskLib from './gulp.class.tasklib';
let inline = require('gulp-inline-ng2-template');
let KarmaServer = require('karma').Server;

let tsProject = ts.createProject('tsconfig.json');
let lib = new TaskLib();
const DEST = {
    ROOT : './dist',
    JS : './dist/js',
    CSS: './dist/css',
    IMG: './dist/img'
};
const APP = `${DEST.ROOT}/app`;
const LINT_CONFIG = 'tslint.json';
const SOURCE = './src/app'
const SOURCE_TS = `${SOURCE}/**/*.ts`;
const LIB = `${DEST.ROOT}/app/node_modules`;
const PROD_CODE_FILE = 'app.js';
const INDEX = 'index.html';
const CACHE_REPLACER = /v11111v/g;
const VERSION_REPLACER = /tag11111tag/g;
const SYS_CONFIG = 'systemjs.config.js';
const NODE_DIR = 'node_modules';
const ROOT = '/';
const ASSETS = {
        IMG: './assets/img/*',
        CSS: './assets/css/'
}

gulp.task('copy.assets', () => {
    gulp.src(INDEX)
        .pipe(replace(CACHE_REPLACER, new Date().getTime().toString()))
        .pipe(replace(VERSION_REPLACER, lib.getTag()))
        .pipe(gulp.dest(DEST.ROOT));
    gulp.src(lib.LIB)
        .pipe(gulp.dest(DEST.JS));
    gulp.src(ASSETS.IMG)
        .pipe(gulp.dest(DEST.IMG));
    gulp.src([path.join(ASSETS.CSS, 'bootstrap.min.css'), path.join(ASSETS.CSS, 'kafkan.css')])
        .pipe(concat('main.css'))
        .pipe(gulp.dest(DEST.CSS));
});

gulp.task ('lint', () => {
    gulp.src(SOURCE_TS)
        .pipe(tslint({
            configuration: LINT_CONFIG,
            formatter: "prose"
        }))
        .pipe(tslint.report({
            emitError: false,
            allowWarnings: true
        }));
});

gulp.task('cleanup', () => {
    del([DEST.ROOT])
        .then(() => {
            console.log(`Deleted ${DEST.ROOT}.`);
        });
});

gulp.task('bundle.js', () => {
    lib.bundler(false, APP);
});

gulp.task('bundle.js.min', () => {
    lib.bundler(true, APP);
});

gulp.task('test', (done) => {
    KarmaServer.start({
        configFile: path.join(process.cwd(), 'karma.conf.js'),
        singleRun: true
    }, () => {
        done();
    });
});

gulp.task('build', () => {
    let result = gulp.src(SOURCE_TS)
        .pipe(inline({ base: SOURCE, useRelativePaths: true }))
        .pipe(tsProject());
    return result.js.pipe(gulp.dest(path.join(DEST.ROOT, 'app')));
});

gulp.task('prod', () => {
    runSequence('cleanup', 'lint', 'build', 'bundle.js', 'copy.assets');
});
gulp.task('prodMin', () => {
    runSequence('cleanup', 'lint', 'build', 'bundle.js.min', 'copy.assets');
});

