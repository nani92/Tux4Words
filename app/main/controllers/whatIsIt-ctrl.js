angular.module('main')
.controller('WhatIsItCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  $('#photoFrame').append($scope.currentImage);
  ShowLifes($scope);
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
