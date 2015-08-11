//'use strict';
angular.module('main')
.controller('TestCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  testNew = {};
  testNew.name = '+';
  testNew.words = {};
  testMy1 = {};
  testMy1.name = 'My1';
  testMy1.words = [];
  wordDog = {};
  wordDog.word = 'Dog';
  wordDog.imgPath = "main/assets/images/words/dog.jpg";
  testMy1.words.push(wordDog);
  $scope.tests = [testNew, testMy1];
  $scope.GoToTest = function (test) {
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
