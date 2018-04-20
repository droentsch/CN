'use strict';

module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],

    preprocessors: {
      'dist/**/!(*spec|index|*.module|*.routes).js': ['coverage']
    },
    reporters: ['mocha', 'coverage', 'karma-remap-istanbul'],
    coverageReporter: {
      dir:  'coverage_js/',
      reporters: [
        { type: 'json', subdir: '.', file: 'coverage-final.json' },
        { type: 'html', subdir: '.' }
      ]
    },
    remapIstanbulReporter: {
      reports: {
        html: 'coverage'
      }
    },

    // list of files / patterns to load in the browser
    files: [
      // Polyfills.
      'node_modules/core-js/client/shim.min.js',
      'node_modules/intl/dist/Intl.min.js',

      'node_modules/traceur/bin/traceur.js',

      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Zone.js dependencies
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/jasmine-patch.js',

      // RxJs.
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // paths loaded via module imports
      // Angular itself
      { pattern: 'node_modules/@angular/**/*.js', included: false, watched: true },
      { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

      { pattern: 'dist/**/*.js', included: false, watched: true },
      { pattern: 'dist/**/*.html', included: false, watched: true, served: true },

      // suppress annoying 404 warnings for resources, images, etc.
      { pattern: 'dist/assets/**/*', watched: false, included: false, served: true },

      //'test-config.js',
      // 'dist/js/app.js'
    ],

    // must go along with above, suppress annoying 404 warnings.
    proxies: {
      '/assets/': '/base/dist/assets/'
    },

    // list of files to exclude
    exclude: [
      'node_modules/**/*spec.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      // 'Chrome'
      'PhantomJS'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    // singleRun: false,
    singleRun: true,
  });
};
