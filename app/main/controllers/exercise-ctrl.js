//'use strict';

angular.module('main')
.controller('ExerciseCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {

  // bind data from service
  this.someData = Start.someData;
  this.ENV = Config.ENV;
  this.BUILD = Config.BUILD;

  console.log('Hello from your Controller: StartCtrl in module main:. This is your controller:', this);
  // TODO: do your controller thing
  $scope.basicOptions = ['Play', 'Categories', 'Play Test', 'Leaderboards'];
  $scope.MoveTo = function (name) {
    if (name === 'Play') {
      $scope.StartExercise($scope.title);
    }
  };
  $scope.title = $state.current.displayName;
  var id = ($state.current.url).substring(1);
  id = id.substring($.inArray('/', id) + 1);
  $scope.id = id;
});
