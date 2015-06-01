'use strict';
angular.module('main')
  .controller('BoardCtrl', function ($scope, $state) {
    console.log('Inside Board');
    console.log($scope, $state);
  });
