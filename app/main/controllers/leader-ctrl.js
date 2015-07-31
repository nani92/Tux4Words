//'use strict';

angular.module('main')
.controller('LeaderboardCtrl', function (Start, Config, $scope, $state, leaders, $location, $window) {
  var maxElement = 10;
  var allLeaders;
  GetListOfLeaders();
  GetFirstrPart();
  function GetFirstrPart () {
    if ( allLeaders.length <= maxElement ) {
      $scope.leaders = allLeaders;
    }
    else {
      $scope.leaders = allLeaders.slice(0, Math.min(allLeaders.length - 1, maxElement));
    }
  }
  function GetListOfLeaders () {
    if ($scope.exerciseState.indexOf("What is it?") >= 0) {
      allLeaders = leaders.getWhatIsItLeaders();
    }
    if ($scope.exerciseState.indexOf("Connect") >= 0) {
      allLeaders = leaders.getConnectLeaders();
    }
    if ($scope.exerciseState.indexOf("Order the letters") >= 0) {
      allLeaders = leaders.getOrderTheLettersLeaders();
    }
    if ($scope.exerciseState.indexOf("Type in") >= 0) {
      allLeaders = leaders.getTypeInLeaders();
    }
    
  }
});
