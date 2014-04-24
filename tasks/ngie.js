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
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // regular expression to find all the directive names and the restrict values (E is the only one we need to process)
    // /directive\s*\(['"](\w+)['"][\w\W]*?restrict:\s*['"](\w)['"]/g

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
        console.log('File being processed: '+filepath);
        var file = grunt.file.read(filepath);
        var regexp = /directive\s*\(['"](\w+)['"][\w\W]*?restrict:\s*['"](\w+)['"]/g;
        var result;
        while ((result = regexp.exec(file)) !== null) {
          console.log(result[0]);
          console.log(result[1]);
          console.log(result[2]);
          console.log('----');
        }
        

        return grunt.file.read(filepath);
      });

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(file.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created.');
    });
  });

};
