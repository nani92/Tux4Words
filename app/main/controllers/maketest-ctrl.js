//'use strict';
angular.module('main')
.controller('MakeTestCtrl', function (Start, Config, $scope, $state, categories, $location, $window, tests) {
  $scope.categories = categories.getCategories();
  $scope.GoToCategory = function (category) {
    if (IsLearningCategory()) {
      $scope.StartCategory(category);
    }
    else {
      ExerciseCategory(category);
    }
  }
  $scope.CreateTest = function () {
    test = {};
    test.name = document.getElementById("makeTest_name").value;
    test.words = GetChosenWords();
    tests.addTest(test);
    $scope.WriteFile('json/', 'tests.json', tests.writeTestsToFile());
    $state.go('root.PlayTest');
  }
  function GetChosenWords () {
    words = [];
    $(".category-checkBox").each( function (index, element) {
      if (document.getElementById(element.id).checked) {
        categoryName = (element.id).substring(3);
        categoryId = categories.getCategoryId(categoryName);
        words = words.concat(categories.getWordsFromCategoryById(categoryId));
      }
    });
    return words;
  }
});
