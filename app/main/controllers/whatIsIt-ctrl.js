angular.module('main')
.controller('WhatIsItCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  $('#photoFrame').append($scope.currentImage);
  ShowLifes($scope);
  $scope.Chosen = function (label) {
    if (label === $scope.currentImage.attr('id')) {
      categories.increaseStatusOfWord(label);
      $scope.SetPoints($scope.points + 10);
      $scope.WhatIsIt_Next();
    }
    else {
      categories.decreaseStatusOfWord($scope.currentImage.attr('id'));
      $scope.AddToCurrentTasks();
      $scope.SetLifes($scope.lifes - 1);
      $scope.ShowProperBoard();
    }
  }
  $scope.$on('onRepeatLast', function (scope, element, attrs) {
    console.log("onRepeat");
    console.log(element);
    FitWordsToLabel();
  });
  
  function FitWordsToLabel() {
    $('.label_button').each(function (key, value) {
      textWidth = $(value.children[0]).width();
      if ( textWidth > $(value).width() ) {
        divHeight = $(value).css("height");
        while (textWidth > $(value).width() ) {
          decreaseFont($(value.children[0]));
          textWidth = $(value.children[0]).width();
        }
        $(value).css("height", divHeight);
      }
    });
  }
  
  function decreaseFont(elementSpan) {
    oldFontSize = parseInt(elementSpan.css("font-size"));
    elementSpan.css({"font-size": (oldFontSize - 10) + "px"});
  }
});
