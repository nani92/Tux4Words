//'use strict';

angular.module('main')
.controller('HistoryCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  allLearnedWords = categories.getListOfLearnedWords();
  GetFirstrPart();
  
  function GetFirstrPart () {
    if ( allLearnedWords.length <= 3 ) {
      $scope.learnedWords = allLearnedWords;
    }
    else {
      $scope.learnedWords = allLearnedWords.slice(0, Math.min(allLearnedWords.length - 1, 2));
    }
  }
  $scope.loadMore = function () {
    console.log("loadMore");
    base = $scope.learnedWords.length;
    for ( i = 0; i < 3 && (i + base) < allLearnedWords.length; i++) {
      $scope.learnedWords.push(allLearnedWords[base + i]);
    }
  }
});
