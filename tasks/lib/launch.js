
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
                name         : pkg.name,
                v            : grunt.option('pkg') || pkg.version || '?.?.?',
                env          : process.env.NODE_ENV || 'development',
                branch       : this.options.branch,
                git          : this.options.git,
                remote       : grunt.option('remote') || this.options.remote,
                remotepath   : this.options.remotepath,
                sitePath     : this.options.sitePath,
                tempDir      : this.options.tempDir,
                subDir       : this.options.subDir || '' // Sub-directory to copy to remote
            };

            var fullSitePath = share.info.sitePath + '-' + share.info.env;

            share.info.versionedPath = fullSitePath + '/.versions/' + share.info.name + '@' + share.info.v;
            share.info.livePath      = fullSitePath + '/' + share.info.name;
            share.tempdir            = share.info.tempDir || '/tmp/' + share.info.name + '-launch/';

            // Make settings global.
            global['launchConfig'] = share;
            action.notice('share.info: ' + require('util').inspect(share.info));

            action.success('Collected launch info');
            done();
        }.bind(this)); // Binding this so this.options are carried over into the callback.

    };

    // Remove old temp directory
    exports.removeOldTempDir = function () {
        // Doesn't seem to recognize when it has already ran info.
        //grunt.task.requires('info');
        var done = this.async();

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
        var cmd  = '';

        if (share.info.git) {
            cmd = 'git --work-tree=/tmp/genesis-myghr/ checkout -f ' + share.info.branch;
        } else { 
            cmd = 'git checkout-index --prefix=' + share.tempdir + ' -a -f';
        }

        action.notice('Current directory: ' + process.cwd());
        action.local(cmd, function (exitcode) {
            if (exitcode === 0) {
                action.success('Repo checked out to a temporary directory');
                done();
            } else {
                action.error('Could not checkout a copy of the repo');
                done(false);
            }
        });
    };

    // Create versioned site directory
    exports.createVersionedDir = function () {
        var done = this.async();

        action.remote(share.info.remote, 'mkdir -p ' + share.info.versionedPath, function (exitcode) {
            if (exitcode === 0) {
                action.success('Versioned directory created: ' + share.info.versionedPath);
                done();
            }
            else {
                action.error('Failed to create versioned directory.');
                done(false);
            }
        });
    };

    // Move files to remote server
    exports.putRemote = function () {
        var done = this.async();

        var env = share.env ? share.env + '/' : '';
        var cmd = 'rsync -arvz ' + share.tempdir + share.info.subDir + ' ' + share.info.remote + ':' + share.info.versionedPath;
        action.local(cmd, function (exitcode) {
            if (exitcode === 0) {
                action.success('Repo contents put to remote');
                done();
            } else {
                action.error('Could not put repo to remote. Make sure ' + share.info.versionedPath + ' directory exists');
                done(false);
            }
        });
    };

    // Install npm dependencies
    exports.installDependencies = function () {
        var done = this.async();
        var cmd  = 'npm install ' + (share.info.env !== 'development' ? '--production' : '');

        action.remote(share.info.remote, cmd, function (exitcode) {
            if (exitcode === 0) {
                action.success('Dependencies installed');
                done();
            } else {
                action.error('Failed to install dependencies');
                done(false);
            }
        }, { cwd: share.info.versionedPath });
    };

    // Move temp files to versioned directory
    exports.moveTempToVersioned = function () {
        var done = this.async();

        action.remote('sudo rsync -a ' + share.tempdir + share.info.subDir + ' ' + share.info.versionedPath, function (exitcode) {
            if (exitcode === 0) {
                action.success('Temporary files successfully moved to versioned path.');
                done();
            }
                else {
                    action.error('Failed to move files from ' + share.tempDir + ' to ' + share.info.versionedPath);
                    done(false);
                }
        });

    };

    // Create symbolic link from version to live
    exports.symbolicLink = function () {
        var done = this.async();
        
        action.remote(share.info.remote, 'ln -sfv -T ' + share.info.versionedPath + ' ' + share.info.livePath, function (exitcode) {
            if (exitcode === 0) {
                action.success('Successfully created the symbolic link.');
                done();
            }
            else {
                action.error('Failed to create a symbolic link from ' + share.info.versionedPath + ' to ' + share.info.livePath);
                done(false);
            }
        });
    };

    return exports;
};
