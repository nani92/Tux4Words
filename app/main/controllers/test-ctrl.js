//'use strict';
angular.module('main')
.controller('TestCtrl', function (Start, Config, $scope, $state, categories, $location, $window, tests) {
  $scope.tests = tests.getTestList();
  $scope.GoToTest = function (test) {
    if (test.name === '+') {
      $state.go('root.MakeTest');
      return;
    }
    ExerciseTest(test);
  }
  function ExerciseTest (inTest) {
    if ($scope.exerciseState.indexOf("What is it?") >= 0) {
      $scope.StartTest_WhatIsIt(inTest);
    }
    else if ($scope.exerciseState.indexOf("Connect") >= 0) {
      $scope.StartTest_Connect(inTest);
    }
    else if ($scope.exerciseState.indexOf("Order the letters") >= 0) {
      $scope.StartTest_OrderTheLetters(inTest);
    }
    else if ($scope.exerciseTest.indexOf("Type in") >= 0) {
      $scope.StartCategory_TypeIn(inTest);
    }
  }
});
