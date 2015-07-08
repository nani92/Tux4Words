//'use strict';

angular.module('main')
.controller('HistoryCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  $scope.learnedWords = categories.getAllLearnedWords();
});
