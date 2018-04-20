const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

const ROOT = '/home/kafkan';
const COVERAGE_SRC = [`${ROOT}/lib/**.js`, `${ROOT}/app.js`];

gulp.task('coverage.prep', () => {
    return gulp.src(COVERAGE_SRC)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});
gulp.task('test', () => {
    return gulp.src('/home/kafkan/testing/tests/*.test.js', {
            read: false
        })
        .pipe(mocha())
        .pipe(istanbul.writeReports({
            dir: './coverage',
            reporters: ['lcov', 'json', 'text', 'text-summary'],
            reportOpts: {
                dir: './coverage'
            },
            coverageVariable: 'KafkaN'
        }));
});

gulp.task('default', ['coverage.prep', 'test']);