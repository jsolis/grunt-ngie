'use strict';

angular.module('sample2aApp')
  .directive('item', [function() {
    return {
      restrict: 'EA',
      templateUrl: 'partials/item.html',
      controller: function ($scope) {
        console.log('doing some item stuff');
      },
      link: function (scope, element, attrs) {
        scope.foo = attrs.bar;
      }
    };
  }]);