//'use strict';
angular.module('main')
.controller('CategoriesCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  $scope.categories = categories.getCategories();
  $scope.GoToCategory = function(category) {
    console.log(category);
    if (IsLearningCategory()) {
      $scope.StartCategory(category);
    }
  }
  
  function IsLearningCategory () {
    if ($scope.exerciseState === "") {
      return true;
    }
    return false;
  }
});
