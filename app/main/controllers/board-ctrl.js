//'use strict';

var taskNumbers = 12;
angular.module('main')
  .controller('BoardCtrl', function ($scope, $state, categories, $compile) {
    $('#photoFrame').append($scope.currentImage);
    $('#photoFrame').append('<span id=d' + $scope.currentImage.attr('id').length + ' >' + $scope.currentImage.attr('id'));
    if ($scope.isLastWord) {
      if ($scope.isSessionStarted) {
        $('#nextContainer').children('div:first').detach();
        $('#nextContainer').append($compile('<div id="buttonNext" ng-click="BackToMenu()"></div>')($scope));
        $('#buttonNext').append('<span id="finish"> Finish</span>');
      }
      else {
        $('#nextContainer').children('div:first').detach();
        $('#nextContainer').append($compile('<div id="buttonNext" ng-click="BackToExercise()"></div>')($scope));
        $('#buttonNext').append('<span id="finish"> Finish</span>');
      }
    }
    $scope.BackToMenu = function () {
      $scope.EndSession();
      $state.go('root.main');
    }
  });
