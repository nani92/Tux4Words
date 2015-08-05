//'use strict';

var taskNumbers = 12;
angular.module('main')
  .controller('BoardCtrl', function ($scope, $state, categories, $compile) {
    $('#photoFrame').append($scope.currentImage);
    $('#photoFrame').append('<span id=d' + $scope.currentImage.attr('id').length + ' >' + $scope.currentImage.attr('id'));
    if ($scope.isLastWord) {
      $('#nextContainer').children('div:first').detach();
      if ($scope.isSessionStarted) {
        FinishButtonForLastBoardInSession();
      }
      else {
        FinishButtonForCorrectAnswerBoard();
      }
    }
    $scope.BackToMenu = function () {
      $scope.EndSession();
      $state.go('root.main');
    }
    function FinishButtonForLastBoardInSession () {
      $('#nextContainer').append($compile('<div id="buttonNext" ng-click="BackToMenu()"></div>')($scope));
      $('#buttonNext').append('<span id="finish"> Finish</span>');
    }
    function FinishButtonForCorrectAnswerBoard () {
      $('#nextContainer').append($compile('<div id="buttonNext" ng-click="BackToExercise()"></div>')($scope));
      $('#buttonNext').append('<span id="finish"> Finish</span>');
    }
  });
