//'use strict';

angular.module('main')
.controller('SettingsCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  $scope.title = "Settings";
  $scope.ChangedNumberOfWordsPerSession = function () {
    $scope.SetWordsPerSession(document.getElementById("wordsPerSession_Input").value);
  };
});
