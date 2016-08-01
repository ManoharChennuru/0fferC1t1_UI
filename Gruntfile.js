module.exports = function configureGrunt(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    const userConfig = require('./build.config.js');
    const taskConfig = {
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: '/**\n' +
            ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '**/'
        },

        clean: {
            build: ['<%= build_dir %>'],
            temp: ['<%= temp_dir %>'],
            options: {force: true}
        },

        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['<%= app_files.js %>'],
                        dest: '<%= temp_dir %>/babel'
                    }
                ]
            }
        },

        pug: {
            build_pug: {
                options: {pretty: true},
                files: [
                    {
                        src: ['<%= app_files.pug %>'],
                        dest: '<%= build_dir %>',
                        cwd: '<%= app_files.pug_dir %>',
                        expand: true,
                        ext: '.html'
                    }
                ]
            }
        },

        copy: {
            build_app_assets: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= build_dir %>',
                        cwd: '<%= app_files.assets_dir %>',
                        expand: true
                    }
                ]
            }
        },

        concat: {
            build_css: {
                src: [
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/<%= app_files.cssdest %>'
                ],
                dest: '<%= build_dir %>/<%= app_files.cssdest %>'
            },
            build_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [
                    '<%= vendor_files.js %>',
                    '<%= temp_dir %>/babel/**/*.js'
                ],
                dest: '<%= build_dir %>/<%= app_files.jsfilename %>.js'
            }
        },

        htmlmin: {
            compile: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= build_dir %>',
                    src: ['**/*.html'],
                    dest: '<%= build_dir %>'
                }]
            }
        },

        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>',
                    beautify: {
                        beautify: false,
                        ascii_only: true
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= build_dir %>',
                    src: ['*.js'],
                    dest: '<%= build_dir %>'
                }]
            }
        },

        sass: {
            dist: {
                files: {
                    '<%= build_dir %>/<%= app_files.cssdest %>': '<%= app_files.sass %>'
                }
            }
        },

        karma: {
            options: {
                files: [
                    '<%= test_files.vendor %>',
                    '<%= vendor_files.js %>',
                    '<%= test_files.src %>'
                ],
                //plugins: ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-babel-preprocessor'],
                browsers: ['PhantomJS'],
                reporters: ['progress', 'coverage'],
                //logLevel: 'DEBUG',
                frameworks: ['jasmine'],
                preprocessors: {
                    'src/**/*.js': ['babel'],
                    'src/**/!(*.spec|*.mock)*.js': ['coverage']
                },
                coverageReporter : {
                    reporters:[
                        {type: 'html', dir:'build/coverage/', subdir: '.'},
                        {type: 'text-summary'}
                    ]
                },
                babelPreprocessor: {
                    options: {
                        sourceMap: 'inline'
                    },
                    filename: function(file) {
                        return file.originalPath.replace(/\.js$/, '.es5.js');
                    },
                    sourceFileName: function(file) {
                        return file.originalPath;
                    }
                }
            },
            unit: {
                runnerPort: 9101,
                port: 9103,
                background: true
            },
            continuous: {
                singleRun: true
            }
        },

        eslint: {
            source: ['<%= test_files.src %>']
        },

        delta: {
            options: {
                spawn: false
            },

            pug: {
                options: {
                    cwd: '<%= app_files.pug_dir %>'
                },
                files: [
                    '<%= app_files.pug %>'
                ],
                tasks: ['pug:build_pug']
            },

            sass: {
                files: ['<%= app_files.sasswatch %>'],
                tasks: ['sass', 'concat:build_css']
            },

            js: {
                files: [
                    '<%= test_files.src %>'
                ],
                tasks: ['babel', 'concat:build_js', 'karma:unit:run', 'eslint']
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['build', 'karma:unit', 'delta']);

    grunt.registerTask('default', ['build', 'compile']);

    grunt.registerTask('build', [
        'eslint',
        'clean',
        'babel',
        'sass',
        'pug',
        'concat:build_css',
        'concat:build_js',
        'copy:build_app_assets',
        'karma:continuous']
    );

    grunt.registerTask('compile', [
        'uglify:compile'
    ]);
};
