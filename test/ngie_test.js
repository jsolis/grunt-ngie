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

exports.ngie = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  default_options: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index-default.html');
    var expected = grunt.file.read('test/expected/index-default.html');
    test.equal(actual, expected, 'by default ie fix is inserted to the end of the head tag.');

    test.done();
  },
  custom_options: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index-custom.html');
    var expected = grunt.file.read('test/expected/index-custom.html');
    test.equal(actual, expected, 'custom option to override where ie fix gets appended to.');

    test.done();
  },
  // TODO - add test for unminified files

  // TODO - add test for traversing source directories
  directory_options: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index-directory.html');
    var expected = grunt.file.read('test/expected/index-directory.html');
    test.equals(actual, expected, 'directory traversing and unminified file inspecting.');

    test.done();
  }
};
