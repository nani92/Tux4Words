'use strict';
angular.module('main')
  .controller('BoardCtrl', function ($scope, $state, sharedData) {
    console.log('Inside Board');
    console.log($scope, $state);
    console.log(sharedData.getCategories());
  });
