//'use strict';

var taskNumbers = 12;
angular.module('main')
  .controller('BoardCtrl', function ($scope, $state, categories, $compile) {
    $('#photoFrame').append($scope.currentImage);
    $('#photoFrame').append('<span id=d' + $scope.currentImage.attr('id').length + ' >' + $scope.currentImage.attr('id'));
    if ($scope.isLastWord) {
      $('#nextContainer').children('div:first').detach();
      //$('#buttonNext').children('span:first').detach();
      //$('#buttonNext').children('div:first').detach();
      //$('#buttonNext').removeAttr('ng-click');
      $('#nextContainer').append($compile('<div id="buttonNext" ng-click="BackToMenu()"></div>')($scope));
      //$('#buttonNext').attr('ng-click', 'BackToMenu()');
      $('#buttonNext').append('<span id="finish"> Finish</span>');
    }
    $scope.BackToMenu = function () {
      console.log('Finish');
      $state.go('root.main'); 
    }
  });
