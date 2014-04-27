/*
 * ngie
 * https://github.com/jsolis/grunt-ngie
 *
 * Copyright (c) 2014 Jason Solis
 * Licensed under the MIT license.
 */

'use strict';

var cheerio = require('cheerio');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ngie', 'Automatically add DOM elements for your Angular custom directives', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      destTag: 'head'
    });

    var ieFixStart = '<!--[if lte IE 8]><script>(function(){';
    var ieFixBody = '';
    var ieFixEnd = 'for (var i=0;i<ngieElements.length;i++) { document.createElement(ngieElements[i]); } })()</script><![endif]-->';
    var elements = ['ng-include', 'ng-pluralize', 'ng-view', 'ng:include', 'ng:pluralize', 'ng:view'];

    // The regular expression used below is used to find all the directive names 
    //  and the restrict values (E is the only one we need to process)

    grunt.log.writeln('ngieifying ' + grunt.log.wordlist(this.files.map(function (file) {
      return file.src;
    })));

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
          if (result[2].indexOf('E') > -1) {
            elements.push(result[1]);
          }
        }
        return grunt.file.read(filepath);
      });

      ieFixBody = 'var ngieElements = ' + JSON.stringify(elements) + ';';
      var fix = ieFixStart + ieFixBody + ieFixEnd;

      // load file.dest in cheerio
      var indexFilepath = file.dest;
      var indexFile = grunt.file.read(indexFilepath);
      var $ = cheerio.load(indexFile);
      
      // append the fix to the destTag
      $(options.destTag).append(fix);

      // Write the destination file.
      var destFileFixed = $.html();
      var destFilePath = options.fileDestOverride || file.dest;
      grunt.file.write(destFilePath, destFileFixed);

      // Print a success message.
      grunt.log.writeln('All your IE is fixed: "' + file.dest + '" created.');
    });
  });

};
