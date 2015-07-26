//'use strict';

angular.module('main')
.controller('LeaderboardCtrl', function (Start, Config, $scope, $state, leaders, $location, $window) {
  allLeaders = leaders.getWhatIsItLeaders();
  GetFirstrPart();
  function GetFirstrPart () {
    if ( allLeaders.length <= 3 ) {
      $scope.leaders = allLeaders;
    }
    else {
      $scope.leaders = allLeaders.slice(0, Math.min(allLeaders.length - 1, 2));
    }
  }
  $scope.loadMore = function () {
    base = $scope.leaders.length;
    for ( i = 0; i < 3 && (i + base) < allLeaders.length; i++) {
      $scope.leaders.push(allLeaders[base + i]);
    }
  }
});
