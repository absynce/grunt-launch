'use strict';

var spawn = require('child_process').spawn;

require('./colors');

module.exports = function (grunt) {
    var exports = {
        options: {}
    };

    exports.error = function (message) {
        grunt.log.writeln('  ✘ '.red + ' ' + message + '\n');
    };

    exports.success = function (message) {
        grunt.log.writeln('  ✔ '.green + ' ' + message + '\n');
    };

    exports.notice = function (message) {
        grunt.log.writeln('  ● '.yellow + ' ' + message + '\n');
    };

    exports.printItem = function (prefix, item) {
        grunt.log.write(prefix);
        Object.keys(item).forEach(function (key) {
            grunt.log.write('|-- ' + key + ': ' + item[key]);
        });
    };

    exports.remote = function (host, cmd, callback, options) {
        var tty = '';
        this.options = options || {};

        if (this.options.cwd) {
            cmd  = 'cd ' + this.options.cwd + ' ; ' + cmd;
            tty = '-tt';
        }
        debugger;
        var ssh = spawn('ssh', [host, tty, cmd]), out = '';

        process.stdout.write(('\n  $ ssh ' + host + ' ' + cmd + '\n    ').blue);

        ssh.stdout.on('data', function (data) {
            out += data;
            process.stdout.write(('' + data).replace(/\n/g, '\n    ').grey);
        });

        ssh.stderr.on('data', function (data) {
            process.stdout.write(('' + data).replace(/\n/g, '\n    ').red);
        });

        ssh.on('exit', function (code) {
            callback(code, out);
        });

        ssh.stdin.end();
    };

    exports.local = function (cmd, callback, options) {
        this.options = options || {};

        cmd = cmd.split(' ');
        var pname = cmd.shift(),
        proc = spawn(pname, cmd, { cwd: this.options.cwd });

        if (this.options.cwd) {
            grunt.log.writeln(('\n  $ cd ' + this.options.cwd).blue);
        }

        grunt.log.writeln(('\n  $ ' + pname + ' ' + cmd.join(' ')).blue);
        process.stdout.write('\n    ');

        proc.stdout.on('data', function (data) {
            process.stdout.write(('' + data).replace(/\n/g, '\n    ').grey);
        });

        proc.stderr.on('data', function (data) {
            process.stdout.write(('' + data).replace(/\n/g, '\n    ').red);
        });

        proc.on('exit', function (code) {
            callback(code);
        });

        proc.stdin.end();
    };

    return exports;
};