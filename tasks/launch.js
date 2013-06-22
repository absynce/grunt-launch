/*
 * grunt-launch
 * https://github.com/absynce/grunt-launch
 *
 * Copyright (c) 2013 Jared M. Smith
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    
    var spawn = require('child_process').spawn,
    fs = require('fs'),
    action = require('./lib/action')(grunt);

    var share = share || {};

    grunt.registerMultiTask('launch', 'Launch deployment of your node app.', function() {

        if (this.target === 'info') {
            var done = this.async();


            if (!this.options.remote || !this.options.remotepath) {
                action.error('launch requires certain options');
                done(false);
                return;
            } 

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
            });
        }
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                // Read file source.
                return grunt.file.read(filepath);
            }).join(grunt.util.normalizelf(options.separator));

            // Handle options.
            src += options.punctuation;

            // Write the destination file.
            grunt.file.write(f.dest, src);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
