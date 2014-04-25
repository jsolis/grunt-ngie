/*
 * ngie
 * https://github.com/jsolis/grunt-ngie
 *
 * Copyright (c) 2014 Jason Solis
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ngie', 'Automatically add DOM elements for your Angular custom directives', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    // TODO - update these to our options
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var ieFixStart = '<!--[if lte IE 8]><script>(function(){';
    var ieFixBody = '';
    var ieFixEnd = 'for (var i=0;i<ngieElements.length;i++) { document.createElement(ngieElements[i]); } })()</script><![endif]-->';
    var elements = [];

    // The regular expression used below is used to find all the directive names 
    //  and the restrict values (E is the only one we need to process)

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      // Concat specified files.
      var src = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
        var file = grunt.file.read(filepath);
        var regexp = /directive\s*\(['"](\w+)['"][\w\W]*?restrict:\s*['"](\w+)['"]/g;
        var result;
        while ((result = regexp.exec(file)) !== null) {
          grunt.log.writeln(result[0]);
          grunt.log.writeln(result[1]);
          grunt.log.writeln(result[2]);
          grunt.log.writeln('----');
          if (result[2].indexOf('E') > -1) {
            elements.push(result[1]);
          }
        }
        return grunt.file.read(filepath);
      });

      ieFixBody = 'var ngieElements = ' + JSON.stringify(elements) + ';';
      var fix = ieFixStart + ieFixBody + ieFixEnd;

      // Write the destination file.
      grunt.file.write(file.dest, fix);

      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created.');
    });
  });

};
