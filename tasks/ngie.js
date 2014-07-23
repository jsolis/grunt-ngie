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

    var ieFixStart = '<!--[if lte IE 8]><script>(function(d){';
    var ieFixBody = '';
    var ieFixEnd = 'for (var i=0;i<e.length;i++) { d.createElement(e[i]); } })(document);</script><![endif]-->';
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
      }).forEach(function (filepath) {
        // Read file source.
        var file = grunt.file.read(filepath);

        var directive_regexp = /directive\s*\(['"](\w+)['"]/g;
        var directive_result, paren_result;
        while((directive_result = directive_regexp.exec(file)) !== null) {
          var paren_regexp = /(?:\/\*(?:[\s\S]*?)\*\/)|(?:\/\/(?:.*)$)|(?:"[\s\S]*?")|(?:'[\s\S]*?')|([\(\)])/gm;
          var directive_name = directive_result[1].replace(/([A-Z])/g, '-$1').toLowerCase();

          var paren_count = 0;
          var directive_end_index;
          while((paren_result = paren_regexp.exec(file.slice(directive_result.index))) !== null) {
            if(typeof(paren_result[1]) === 'undefined') {
              continue;
            }
            paren_count += (paren_result[1] === '(') ? 1 : -1;
            if(paren_count === 0) {
              directive_end_index = paren_result.index;
              break;
            }
          }

          if(typeof(directive_end_index) === 'undefined') {
            continue;
          }

          var restrict_regexp = /restrict:\s*['"]\w*(E)\w*['"]/g;

          var directive = file.slice(directive_result.index, directive_result.index+directive_end_index+1);
          var restrict_result = restrict_regexp.exec(directive);
          if(restrict_result !== null && typeof(restrict_result[1]) !== 'undefined') {
            elements.push(directive_name);
          }
        }
      });

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
