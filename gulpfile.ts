import * as del from 'del';
import * as gulp from 'gulp';
import * as concat from 'gulp-concat';
import * as flatten from 'gulp-flatten';
import * as mocha from 'gulp-mocha';
import * as replace from 'gulp-replace';
import tslint from 'gulp-tslint';
import * as ts from 'gulp-typescript';
import * as path from 'path';
import * as runSequence from 'run-sequence';
import { NodeLib } from './nodeLib';

let tsProject = ts.createProject('tsconfig.json');
let lib = new NodeLib();
const DEST = './dist';
const LINT_CONFIG = 'tslint.json';
const SOURCE = './src';
const SOURCE_TS = `${SOURCE}/**/*.ts`;
const SOURCE_TEST = `${DEST}/**/*.test.js`;
const NODE_DIR = 'node_modules';
const DESTINATION_MODULES = `${DEST}/${NODE_DIR}`;
const ROOT = '/';

gulp.task('lint', () => {
    gulp.src(SOURCE_TS)
        .pipe(tslint({
            configuration: LINT_CONFIG,
            formatter: 'prose',
        }))
        .pipe(tslint.report({
            allowWarnings: false,
            emitError: false,
        }));
});

gulp.task('cleanup', () => {
    return del(DEST)
        .then(() => {
            console.info(`Deleted ${DEST}`);
        });
});

gulp.task('cleanup.test', () => {
    return del(SOURCE_TEST)
        .then(() => {
            console.info(`Deleted ${SOURCE_TEST}`);
        });
});

gulp.task('build', () => {
    let result = gulp.src([SOURCE_TS, `!${SOURCE}/**/testing/`, `!${SOURCE}/**/testing/**/*`, `!${SOURCE}/**/*.test.ts`])
        .pipe(tsProject());
    return result.js.pipe(gulp.dest(DEST));
});

gulp.task('build.test', () => {
    let result = gulp.src([`${SOURCE}/**/testing/`, `${SOURCE}/**/testing/**/*.ts`, `${SOURCE}/testing/tests/**/*.test.ts`])
        .pipe(tsProject());
    return result.js.pipe(gulp.dest(DEST));
});

gulp.task('copy.dependencies', () => {
    let libs: any[] = lib.libs();
    libs.forEach((mod) => {
        gulp.src(mod.src)
            .pipe(gulp.dest(`${DEST}/${mod.dest}`));
    });
});

gulp.task('test.built.js', () => {
    return gulp.src(`${DEST}/testing/tests/*.js`, {read: false})
        .pipe(mocha());
});

gulp.task('prod', (done: () => void ) => {
    runSequence('cleanup', 'lint', 'build', done);
    // runSequence('cleanup', 'lint', 'build', 'copy.dependencies', done);
});
gulp.task('test', () => {
    runSequence('cleanup.test', 'build.test');
});
gulp.task('test.full', () => {
    runSequence('cleanup.test', 'build.test', 'test.built.js');
});
