angular.module('main')
.controller('TypeInCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  $('#imageContainer').prepend($scope.currentImage);
  ShowLifes($scope);
  $scope.input = "";
  desiredLength = $scope.currentImage.attr("id").length;
  $scope.Pressed = function (key) {
    $scope.input = $scope.input + key;
    if ( $scope.input.length == desiredLength ) {
      setTimeout(function () {
        if (IsAnswerCorrect()) {
          $scope.SetPoints($scope.points + 10);
        }
        else {
          $scope.SetLifes($scope.lifes - 1);
        }
        $scope.TypeIn_Next();
      }, 200);
    }
  }
  function IsAnswerCorrect() {
    if ( $scope.input === $scope.currentImage.attr("id") ) {
      return true;
    }
    return false;
  }
});
