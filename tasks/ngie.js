/*
 * ngie
 * https://github.com/jsolis/grunt-ngie
 *
 * Copyright (c) 2014 Jason Solis
 * Licensed under the MIT license.
 */

'use strict';

var cheerio = require('cheerio');
var parseDirectives = require('ng-directive-parser').parseCode;

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ngie', 'Automatically add DOM elements for your Angular custom directives', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      destTag: 'head'
    });

    var ieFixStart = '<!--[if lte IE 8]><script>(function(d){';
    var ieFixBody = '';
    var ieFixEnd = 'for (var i=0;i<e.length;i++) { d.createElement(e[i]); } })(document);</script><![endif]-->';
    var defaultElements = ['ng-include', 'ng-pluralize', 'ng-view', 'ng:include', 'ng:pluralize', 'ng:view'];

    grunt.log.writeln('ngieifying ' + grunt.log.wordlist(this.files.map(function (file) {
      return file.src;
    })));

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      var elements = defaultElements.slice();

      // Concat specified files.
      var src = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function (filepath) {
        // Read file source.
        var file = grunt.file.read(filepath);
        var parsed = parseDirectives(filepath, file);

        parsed.forEach(function(d){
          if(d && d.restrict.E){
            elements.push(d.name.replace(/([A-Z])/g, '-$1').toLowerCase());
          }
        });

      });

      // Remove duplicate matches.
      elements = elements.reduce(function(memo, val){
        if(memo.indexOf(val) === -1){
          memo.push(val);
        }
        return memo;
      }, []);

      ieFixBody = 'var e = ' + JSON.stringify(elements) + ';';
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
