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
          categories.increaseStatusOfWord($scope.currentImage.attr('id'));
        }
        else {
          $scope.SetLifes($scope.lifes - 1);
          categories.decreaseStatusOfWord($scope.currentImage.attr('id'));
          $scope.AddToCurrentTasks();
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
