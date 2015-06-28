//'use strict';
angular.module('main')
.controller('StartCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  $scope.basicOptions = ['Play', 'Categories'];
  $scope.exerciseOptions = ['What is it?', 'Connect', 'Order the letters', 'Type in'];
  $scope.MoveTo = function (option, name) {
    if (name === "Play") {
      $scope.StartPlay();
      return;
    }
    $state.go("root." + name);
  };
});
