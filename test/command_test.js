'use strict';

var command = require('../tasks/lib/command');
var _       = require('underscore');

exports.command = {
  split: {
    setUp: function (done) { done(); },
    grepTest: function (test) {
      var cmd      = 'grep -e "i space" ../Gruntfile.js';
      var expected = ['grep', '-e', 'i space', '../Gruntfile.js'];

      var actual   = command.split(cmd);

      test.ok(_.isEqual(actual, expected));
      test.done();
    },
    multiSpaceTest: function (test) {
      var cmd      = 'grep -e "i have many space" ../Gruntfile.js';
      var expected = ['grep', '-e', 'i have many space', '../Gruntfile.js'];

      var actual   = command.split(cmd);

      test.ok(_.isEqual(actual, expected));
      test.done();
    }
  }
};
