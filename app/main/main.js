//'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider) {

  console.log('Allo! Allo from your module: ' + 'main');

  $urlRouterProvider.otherwise('/main/');

  // some basic routing
  $stateProvider
    .state('root', {
      url: '/',
      controller: "RootCtrl",
      template: "<div ui-view></div>"
    })
    .state('root.main', {
      url: 'main/',
      replace: true,
      templateUrl: 'main/templates/homeScreen.html',
      controller: 'StartCtrl as start'
    })
    .state('root.Play', {
      url: 'play/',
      replace: true,
      templateUrl: 'main/templates/board.html',
      controller: 'BoardCtrl'
    })
    .state('root.What is it?', {
      displayName: 'What is it?',
      url: 'whatIsIt/',
      replace: true,
      templateUrl: 'main/templates/exercises.mainScreen.html',
      controller: 'ExerciseCtrl'
    })
    .state('root.What is it?-Play', {
      displayName: 'What is it?',
      url: 'whatIsIt/play/',
      replace: true,
      templateUrl: 'main/templates/exercise.whatisit.play.html',
      controller: 'ExerciseCtrl'
    })
    .state('root.Connect', {
      displayName: 'Connect',
      url: 'connect/',
      replace: true,
      templateUrl: 'main/templates/exercises.mainScreen.html',
      controller: 'ExerciseCtrl'
    })
    .state('root.Order the letters', {
      displayName: 'Ordrer the letters',
      url: 'orderTheLetters/',
      replace: true,
      templateUrl: 'main/templates/exercises.mainScreen.html',
      controller: 'ExerciseCtrl'
    })
    .state('root.Type in', {
      displayName: 'Type in',
      url: 'typeIn/',
      replace: true,
      templateUrl: 'main/templates/exercises.mainScreen.html',
      controller: 'ExerciseCtrl'
    });
})
.service('categories', function () {
  var categories = [];
  return {
    getCategories: function () {
      var names = [];
      $.each(categories, function (i, category) {
        names.push(category.name)
      });
      return names;
    },
    setCategories: function (value) {
      categories = value;
    },
    addCategory: function (inCategory) {
      categories.push({name: inCategory,
                      words: []});
      return categories.length - 1;
    },
    getCategoryId: function (inCategory) {
      if (categories.length == 0) {
        return -1;
      }
      var findCategory = $.grep(categories, function (category, i) {
        console.log(category.name);
        if (category.name == inCategory) {
          return i;
        }
      });
      if (findCategory.length == 0) {
        return -1;
      }
      else {
        return categories.indexOf(findCategory[0]);
      }
    },
    setWordsToCategoryById: function (inId, inWords) {
      categories[inId].words = inWords;
    },
    addWordsToCategoryById: function (inId, inWords) {
      console.log(inId);
      $.merge(categories[inId].words, inWords);
    },
    getWordsFromCategoryById: function (inId) {
      return categories[inId].words;
    },
    getAllWords: function () {
      var words = [];
      $.each(categories, function (i, category) {
        $.merge(words, category.words);
      });
      return words;
    }
  };
});
