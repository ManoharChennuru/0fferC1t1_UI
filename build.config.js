module.exports = {

    build_dir: 'build',
    temp_dir: '.build-temp',

    app_files: {
        assets_dir: 'assets',

        js: ['src/**/*.js', '!src/**/*.spec.js'],

        pug: ['**/*.pug', '!**/_*.pug'],
        pug_dir: 'src',

        sass: 'src/**/*.scss',

        sasswatch: 'src/**/*.scss',

        cssdest: 'site.css',
        jsfilename: 'site'
    },

    test_files: {
        //responsible for all source files
        //includes actual source, specs, mocks
        //excludes not supported unless 1 expression
        src: [
            'src/**/*.js'
        ],
        vendor: [

        ]
    },

    vendor_files: {
        js: ["third-party/angucomplete-alt/dist/angucomplete-alt.min.js"],
        css: ['third-party/angucomplete-alt/angucomplete-alt.css']
    }
};
