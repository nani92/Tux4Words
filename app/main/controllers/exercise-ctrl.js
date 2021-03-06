//'use strict';

angular.module('main')
.controller('ExerciseCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  $scope.SetExerciseState();
  console.log($scope.isSessionStarted);
  $scope.basicOptions = ['Play', 'Categories', 'Play Test', 'Leaderboards'];
  $scope.MoveTo = function (name) {
    if (name === 'Play') {
      $scope.StartExercise($scope.title, $scope.titleId);
    }
    else if (name === 'Leaderboards') {
      $state.go('root.Leaderboards');
    }
    else if (name === 'Categories') {
      $state.go('root.Categories');
    }
    else if (name === 'Play Test') {
      $state.go('root.PlayTest');
    }
  };
  $scope.title = $state.current.displayName;
  var id = $state.current.url;
  $scope.titleId = (id).substring(0, id.length - 1);
});
