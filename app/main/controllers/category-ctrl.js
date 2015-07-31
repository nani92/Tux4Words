//'use strict';
angular.module('main')
.controller('CategoriesCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  $scope.categories = categories.getCategories();
  $scope.GoToCategory = function(category) {
    console.log(category);
    if (IsLearningCategory()) {
      $scope.StartCategory(category);
    }
    else {
      ExerciseCategory(category);
    }
  }
  function IsLearningCategory () {
    if ($scope.exerciseState === "") {
      return true;
    }
    return false;
  }
  function ExerciseCategory (inCategory) {
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
