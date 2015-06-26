//'use strict';
angular.module('main')
.controller('StartCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  // bind data from service
  this.someData = Start.someData;
  this.ENV = Config.ENV;
  this.BUILD = Config.BUILD;

  console.log('Hello from your Controller: StartCtrl in module main:. This is your controller:', this);
  // TODO: do your controller thing
  //ReadJSONPaths(categories);
  $scope.basicOptions = ['Play', 'Categories'];
  $scope.exerciseOptions = ['What is it?', 'Connect', 'Order the letters', 'Type in'];
  $scope.MoveTo = function (option, name) {
    console.log("move");
    if (name === "Play") {
      $scope.StartPlay();
      return;
    }
    $state.go("root." + name);
  };
});
