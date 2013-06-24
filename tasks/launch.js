/*
 * grunt-launch
 * https://github.com/absynce/grunt-launch
 *
 * Copyright (c) 2013 Jared M. Smith
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    var launch = require('./lib/launch')(grunt);

    grunt.registerMultiTask('launch', 'Launch deployment of your node app.', function() {
        
        if (launch[this.target]) {
            launch[this.target].bind(this)(this.data.options);
        }
        else {
            grunt.log.error('The launch option specified does not exist: ' + this.target);
        }
    });
};

