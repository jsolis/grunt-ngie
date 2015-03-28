# ngie 
[![Build Status](https://travis-ci.org/jsolis/grunt-ngie.svg?branch=master)](https://travis-ci.org/jsolis/grunt-ngie)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

> Automatically add DOM elements for your Angular custom directives

Using custom element style directives in Angular breaks IE8 and older unless you specifically call document.createElement() for each one. See the [Angular documentation][1] on this topic for more information.

When writing a large application, it can be cumbersome to keep adding these. Even worse, it is error prone if you add a new directive, forget to add the createElement() call, and miss testing in IE8 (which happens because what developer checks IE8).

This grunt task will run through the specified files and generate a block of code that looks like the below snippet and will add it to your document. This way all your directives will be included in your complied version.

```js
<!--[if lte IE 8]>
<script>
(function(d){
    var e = ["ng-include","ng-pluralize","ng-view","ng:include","ng:pluralize","ng:view","foo","bar","debugger"];
    for (var i=0;i<e.length;i++) {
        d.createElement(e[i]);
    } 
})(document);
</script>
<![endif]-->
```

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ngie --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ngie');
```

If you are using `load-grunt-tasks` this step is not necessary.

## The "ngie" task

### Overview
In your project's Gruntfile, add a section named `ngie` to the data object passed into `grunt.initConfig()`.

Basic example reading your compiled js:
```js
grunt.initConfig({
  ngie: {
    dist: {
      files: {
        'dist/index.html': ['dist/scripts/main-compiled.js']
      }
    }
  }
})
```

Basic example reading your source js:
```js
grunt.initConfig({
  ngie: {
    dist: {
      files: {
        'dist/index.html': ['app/scripts/**/*.js']
      }
    }
  }
})
```

### Files

Basic format:
`'html document to apply fix to': 'files to look for custom directives'`

* The key of each object represents the HTML document serving as your angular app that you want the fix to be appended to.
* The value represents the array of js files in your app where custom directives may be present. You can point this to the list of your source files or a concatenated, minified file.

### Options

#### options.destTag
Type: `String`
Default value: `'head'`

JQuery style selector where the fix will be appended. If not specified we append the fix to the `<head>` tag in your document.

#### options.fileDestOverride
Type: `String`
Default value: `'file.dest'`

An optional alternative location filepath where you want the fixed document to be stored. If not specified we use the dest filepath from the files object.

### Usage Examples

#### Default Options
In this example, the default options are used so the `<script>` tag fix will be applied to the `<head>` element of the document named `app/index.html`. The files `foo.js` and `bar.js` will be inspected for the existence of any custom directives with a type of 'E'.  The file dist/index.html should have already been created.

```js
grunt.initConfig({
  ngie: {
    dist: {
      options: {},
      files: {
        'dist/index.html': ['app/directives/foo.js', 'app/directives/bar.js'],
      }
    }
  }
})
```

#### Custom Options
In this example, the custom option `destTag` is used and so the `<script>` fix will be appened to the `<body>`

```js
grunt.initConfig({
  ngie: {
    dist: {
      options: {
        destTag: 'body'
      },
      files: {
        'dist/index.html': ['app/directives/**/*.js'],
      }
    }
  }
})
```

In this example, the custom option `fileDestOverride` is used and so instead of over writing app/index.html, we read app/index.html, append the fix, and write the fixed version to `dist/index-custom.html`.

```js
grunt.initConfig({
  ngie: {
    dist: {
      options: {
        'fileDestOverride': 'dist/index-custom.html'
      },
      files: {
        'app/index.html': ['app/directives/**/*.js'],
      }
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* version 0.0.1 - initial release with basic functionality
* version 0.0.2 - improved script output
* version 0.0.3 - fixed bug for camel cased element directive names (fooBar -> foo-bar)
* version 0.1.0 - Add support for directives that do not have a restrict defined and used esprima to parse the input files into a syntax tree vs. inaccurate regex (Thanks kevinoconnor7 for both of these contributions)
* version 0.2.0 - Updated to use [ng-directive-parser](https://github.com/jantimon/ng-directive-parser) instead of Esprima directly for more consistent parsing of the Angular directives (Thanks schmod for your contributions)

## License
Copyright (c) 2014 Jason Solis. Licensed under the MIT license.


  [1]: https://docs.angularjs.org/guide/ie
