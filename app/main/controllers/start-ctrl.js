'use strict';
angular.module('main')
.controller('StartCtrl', function (Start, Config, $scope) {

  // bind data from service
  this.someData = Start.someData;
  this.ENV = Config.ENV;
  this.BUILD = Config.BUILD;

  console.log('Hello from your Controller: StartCtrl in module main:. This is your controller:', this);
  // TODO: do your controller thing

  $scope.basicOptions = ["Play", "Categories"];
  $scope.exerciseOptions = ["What is it?", "Connect", "Order the letters", "Type in"];
    
  $scope.MoveTo = function(option){
      console.log("Move to " + option);
  }
});
