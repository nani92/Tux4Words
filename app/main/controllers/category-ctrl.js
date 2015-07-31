//'use strict';
angular.module('main')
.controller('CategoriesCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {
  $scope.categories = categories.getCategories();
});
