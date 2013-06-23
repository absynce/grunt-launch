'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
  test.expect(numAssertions)
  test.done()
  Test assertions:
  test.ok(value, [message])
  test.equal(actual, expected, [message])
  test.notEqual(actual, expected, [message])
  test.deepEqual(actual, expected, [message])
  test.notDeepEqual(actual, expected, [message])
  test.strictEqual(actual, expected, [message])
  test.notStrictEqual(actual, expected, [message])
  test.throws(block, [error], [message])
  test.doesNotThrow(block, [error], [message])
  test.ifError(value)
*/

exports.launch = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    info: {
        setUp: function (done) {
            grunt.task.run('launch:info');
            done();
        },
        test1: function (test) {
            test.expect(1);
            
            var actual = this.options;
            test.ok(true, 'How do I test this?');//'grunt.options: ' + require('util').inspect(actual));
            var expected = { stuff: true };
            //        test.equal(actual, expected, 'should have the same info.');

            test.done();
        }
    },
/*    removeOldTempDir: {
        setUp: function (done) {
            grunt.task.run('launch:removeOldTempDir');
            done();
        },
        test1: function (test) {
            test.expect(1);

            test.ok(!grunt.file.exists('/tmp/grunt-launch-launch'));
            test.done();
        }
    }*/
};
