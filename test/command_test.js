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
    theresOnlyOneTest: function (test) {
      var cmd      = 'elm-test';
      var expected = ['elm-test'];

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
    },
    multiSpaceAtStartTest: function (test) {
      var cmd      = '"a many grep" -e "i have many space" ../Gruntfile.js';
      var expected = ['a many grep', '-e', 'i have many space', '../Gruntfile.js'];

      var actual   = command.split(cmd);

      test.ok(_.isEqual(actual, expected));
      test.done();
    },
    doubleQuotesNoSpaceAtStartTest: function (test) {
      var cmd      = '"elm-reactor" -e "i have many space" ../Gruntfile.js';
      var expected = ['elm-reactor', '-e', 'i have many space', '../Gruntfile.js'];

      var actual   = command.split(cmd);

      test.ok(_.isEqual(actual, expected));
      test.done();
    },
    doubleQuotesNoSpaceSecondArgumentTest: function (test) {
      var cmd      = '"elm-reactor" "i have many space" ../Gruntfile.js';
      var expected = ['elm-reactor', 'i have many space', '../Gruntfile.js'];

      var actual   = command.split(cmd);

      test.ok(_.isEqual(actual, expected));
      test.done();
    }
  }
};
