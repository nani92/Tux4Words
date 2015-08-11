//'use strict';
angular.module('main')
.controller('TestCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  $scope.tests = ['+', 'My1'];
  $scope.GoToTest = function (test) {
    if (IsLearningTest()) {
      $scope.StartCategory(test);
    }
    else {
      ExerciseTest(test);
    }
  }
  function IsLearningTest () {
    if ($scope.exerciseState === "") {
      return true;
    }
    return false;
  }
  function ExerciseTest (inCategory) {
    if ($scope.exerciseState.indexOf("What is it?") >= 0) {
      $scope.StartCategory_WhatIsIt(inCategory);
    }
    else if ($scope.exerciseState.indexOf("Connect") >= 0) {
      $scope.StartCategory_Connect(inCategory);
    }
    else if ($scope.exerciseState.indexOf("Order the letters") >= 0) {
      $scope.StartCategory_OrderTheLetters(inCategory);
    }
    else if ($scope.exerciseState.indexOf("Type in") >= 0) {
      $scope.StartCategory_TypeIn(inCategory);
    }
  }
});
