
module.exports = function (grunt) {
    var exports = {},
    spawn       = require('child_process').spawn,
    fs          = require('fs'),
    action      = require('./action')(grunt);

    var share = share || {};

    // Get package and option info and put into share.info variable.
    exports.info = function (options) { 
        this.options = options;

        grunt.log.writeln('In launch.info');
        grunt.log.writeln('this.options: ' + require('util').inspect(this.options));
        if (!this.options.remote || !this.options.remotepath) {
            action.error('launch requires certain options');
            return;
        } 

        var done = this.async();

        fs.readFile('./package.json', function (err, data) {
            
            if (err) {
                action.error('Make sure a `package.json` file exists in the root of the project');
                done(false);
                return;
            }

            var pkg = JSON.parse(data);

            share.info = {
                name : pkg.name,
                v : pkg.version || '?.?.?',
                remote : this.options.remote,
                remotepath : this.options.remotepath
            };

            action.success('Collected launch info');
            done();
        }.bind(this)); // Binding this so this.options are carried over into the callback.

    };

    // Remove old temp directory
    exports.removeOldTempDir = function () {
        // Doesn't seem to recognize when it has already ran info.
        //grunt.task.requires('info');
        var done = this.async();

        share.tempdir = '/tmp/' + share.info.name + '-launch/';
        action.local('rm -rf ' + share.tempdir, function (exitcode) {
            if (exitcode === 0) {
                action.success('Old temporary directory ' + share.tempdir + ' removed');
                done();
            } else {
                // Note: This never fails with the option -f.
                action.error('Could not remove old temporary directory');
                done(false);
            }
        });
    };

    // Creates a temp directory
    exports.createTempDir = function () {
        // Commented out because it's not working right now.
        // grunt.task.requires('removeOldTempDir');

        var done = this.async();

        action.local('mkdir ' + share.tempdir, function (exitcode) {
            if (exitcode === 0) {
                action.success('New temporary directory \'' + share.tempdir  + '\' created');
                done();
            } else {
                action.error('Could not create temporary directory');
                done(false);
            }
        });
    };

    // Checkout a copy of the repo to a temporary directory
    exports.checkout = function () {
        var done = this.async();

        action.local('git checkout-index --prefix=' + share.tempdir + ' -a -f', function (exitcode) {
            if (exitcode === 0) {
                action.success('Repo checked out to a temporary directory');
                done();
            } else {
                action.error('Could not checkout a copy of the repo');
                done(false);
            }
        });
    };
    
    // Install npm dependencies
    exports.installDependencies = function () {
        var done = this.async();

        grunt.util.spawn({ cmd: 'pwd' },
            /*'cd ' + share.tempdir +
            ' && npm install --production'*/ 
                         function (error, result, exitcode) {
                             var util = require('util');
                             grunt.log.writeln('installDependencies: ');
                             grunt.log.writeln('  error: ' + util.inspect(error));
                             grunt.log.writeln('  result: ' + util.inspect(result));
                             grunt.log.writeln('  exitcode: ' + util.inspect(exitcode));
                if (exitcode === 0) {
                    action.success('Dependencies installed');
                    done();
                } else {
                    action.error('Failed to install dependencies');
                    done(false);
                }
            });
    };
    return exports;
};
