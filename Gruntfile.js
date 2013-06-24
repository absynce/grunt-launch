/*
 * grunt-launch
 * https://github.com/absynce/grunt-launch
 *
 * Copyright (c) 2013 Jared M. Smith
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Configuration to be run (and then tested).
        launch: {
            info: {
                options: {
                    git: false,
                    remote: '?',
                    remotepath: '~/',
                    sitePath: '/var/node-launch-test'
                }
            },
            removeOldTempDir: true,
            createTempDir: true,
            checkout: true,
            installDependencies: true,
            createVersionedDir: true,
            moveTempToVersioned: true,
            symbolicLink: true
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

        // Release
        release: {
            options: {
                npm: true,
                commitMessage: 'Release <%= version %>',
                tagMessage: 'Release <%= version %>'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-release');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'launch', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
