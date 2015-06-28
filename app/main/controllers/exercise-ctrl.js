//'use strict';

angular.module('main')
.controller('ExerciseCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  $scope.basicOptions = ['Play', 'Categories', 'Play Test', 'Leaderboards'];
  $scope.MoveTo = function (name) {
    if (name === 'Play') {
      $scope.StartExercise($scope.title, $scope.titleId);
    }
  };
  $scope.title = $state.current.displayName;
  var id = $state.current.url;
  $scope.titleId = (id).substring(0, id.length - 1);
});
