'use strict';

angular.module('sample1bApp')
  .directive('list', [function() {
    return {
      restrict: 'AE',
      templateUrl: 'partials/list.html',
      controller: function ($scope) {
        console.log('doing some listing stuff');
      },
      link: function (scope, element, attrs) {
        scope.foo = attrs.bar;
      }
    };
  }]);