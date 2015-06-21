angular.module('main')
.controller('ConnectCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  for ( i = 1 ; i <= 3 ; i++) {
    $('#PhotoFrame' + i.toString()).append($scope.connectImages[i - 1]);
  }
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
      //TO DO
      //ShowBoard
      //kill tux
      //ShowNext -> after finish in board?
      $scope.SetLifes($scope.lifes - 1);
      $scope.ShowProperBoard();
      //$scope.WhatIsIt_Next();
    }
  }
});