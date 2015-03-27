/*
 * ngie
 * https://github.com/jsolis/grunt-ngie
 *
 * Copyright (c) 2014 Jason Solis
 * Licensed under the MIT license.
 */

'use strict';

var cheerio = require('cheerio');
var esprima = require('esprima');

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

        var syntax = esprima.parse(file);

        // Executes callback on the object and its children (recursively).
        var traverse = function(object, callback) {
          var key, child;

          // Stop recursion if the callback returns false
          if(callback.call(null, object) !== true) {
            return;
          }
          for (key in object) {
            if (object.hasOwnProperty(key)) {
              child = object[key];
              if (typeof child === 'object' && child !== null) {
                traverse(child, callback);
              }
            }
          }
        };

        // Confirm a call expression callee's name
        var checkCallExpression = function(node, callee_name) {
          return (
            node.type === 'CallExpression' &&
            typeof(node.callee) !== 'undefined' &&
            typeof(node.callee.property) !== 'undefined' &&
            node.callee.property.type === 'Identifier' &&
            node.callee.property.name === callee_name
          );
        };

        // Confirm a directive's restrict propert contains an 'E' in it
        var checkRestrictProperty = function(node) {
          return (
            node.type === "Property" &&
            typeof(node.key) !== 'undefined' &&
            node.key.name === "restrict" &&
            typeof(node.value) !== 'undefined' &&
            node.value.value.indexOf('E') !== -1
          );
        };

        traverse(syntax, function(node) {
          if(
            node.type === "CallExpression" &&
            checkCallExpression(node, 'directive') &&
            node.arguments.length > 1 &&
            node.arguments[0].type === "Literal"
          ) {
            // Hyphonate a directive's name from camelCase
            var directiveName = node.arguments[0].value.replace(/([A-Z])/g, '-$1').toLowerCase();
            traverse(node.arguments.slice(1), function(subNode) {
              if(subNode.type === "Property" && checkRestrictProperty(subNode)) {
                elements.push(directiveName);
                return false;
              }
              return true;
            });
            return false;
          }
          return true;
        });
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
