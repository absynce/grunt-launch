'use strict';

var grunt = require('grunt');
var action = require('../index')(grunt).action;

exports.action = {
  local: {
    setUp: function (done) {
      done();
    },
    testSpaceCommand: function (test) {
      // test space command here
      action.local('grep -e "function (" ./Gruntfile.js', function (exitcode) {
        if (exitcode === 0) {
          action.success('Command with spaces successfully run!');
        }
        else {
          action.error('Command with spaces failed :(');
          test.ok(false, 'Command failed with exit code: ' + exitcode);
        }
        test.done();
      }, {
        stdio: 'inherit'
      });
    }
  }
};
