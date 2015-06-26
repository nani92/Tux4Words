angular.module('main')
.controller('TypeInCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  $('#imageContainer').preppend($scope.currentImage);
  for (i = 3; i > 0; i--) {
    if ($scope.lifes < i ) {
      $('#' + i.toString() + 'life').attr('class', 'dead');
    }
  }
  $scope.Chosen = function (label) {
    if (label === $scope.currentImage.attr('id')) {
      $scope.SetPoints($scope.points + 10);
      $scope.WhatIsIt_Next();
    }
    else {
      $scope.SetLifes($scope.lifes - 1);
      $scope.ShowProperBoard();
    }
  }
});
