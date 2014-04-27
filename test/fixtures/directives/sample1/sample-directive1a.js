'use strict';

angular.module('sample1aApp')
  .directive('login', [function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/login.html',
      controller: function ($scope) {
        console.log('doing some login stuff');
      }
    };
  }]);