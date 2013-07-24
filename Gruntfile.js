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
        launch: {
            info: {
                options: {
                    git: false,
                    remote: 'ght-dev',
                    remotepath: '/tmp/genesis-myghr-launch/',
                    sitePath: '/var/node-launch-test',
                    tempDir: '/tmp/node-launch-tempdir/'
                }
            },
            removeOldTempDir: true,
            createTempDir: true,
            checkout: true,
            createVersionedDir: true,
            putRemote: true,
            installDependencies: true,
            symbolicLink: true
        },
        nodeunit: {
            tests: ['test/*_test.js'],
        },
        release: {
            options: {
                npm: true,
		tagName: 'v<%= version %>',
                commitMessage: 'Release <%= version %>',
                tagMessage: 'Release <%= version %>'
            }
        },
        ignite: {
            start: true,
            restart: true,
            stop: true
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
    
    // Start, stop, or restart the app using forever
    grunt.registerMultiTask('ignite', function () {
        var done   = this.async();
        var share  = global.launchConfig;
        var action = require('./index')(grunt).action;
        var target = this.target;
        var cmd    = 'forever -l forever.log -o out.log -e err.log ' + target + ' ' + share.info.livePath + '/server.js';

        action.remote(share.info.remote, cmd, function (exitcode) {
            if (exitcode === 0) {
                action.success('App successfully restarted.');
                done();
            }
            else {
                action.error('Failed to ' + target + ' app.');
                done(false);
            }
        });
    });
};
