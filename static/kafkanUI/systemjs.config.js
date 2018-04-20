(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'node_modules/': 'node_modules'
        },
        // map tells the System loader where to look for things
        map: {
            // angular bundles
            '@angular/core': 'node_modules/@angular/core/bundles/core.umd.js',
            '@angular/common': 'node_modules/@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'node_modules/@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/common/http': 'node_modules/@angular/common/bundles/common-http.umd.js',
            '@angular/router': 'node_modules/@angular/router/bundles/router.umd.js',
            '@angular/forms': 'node_modules/@angular/forms/bundles/forms.umd.js',

            // other libraries
            'angular2-highcharts': 'node_modules/angular2-highcharts',
            'highcharts': 'node_modules/highcharts',
            'rxjs': 'node_modules/rxjs',
            'angular-in-memory-web-api': 'node_modules/angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
            'main': 'dist/app',
            'tslib': 'node_modules/tslib/tslib.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            main: {
                main: 'main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            highcharts: {
                main: './highcharts.js',
                defaultExtension: 'js'
            },
            'angular2-highcharts': {
                main: './index.js',
                defaultExtension: 'js'
            }
        }
    });
})(this);