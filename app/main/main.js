'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider) {

  console.log('Allo! Allo from your module: ' + 'main');

  $urlRouterProvider.otherwise('/main');

  // some basic routing
  $stateProvider
    .state('main', {
      url: '/main',
      replace: true,
      templateUrl: 'main/templates/homeScreen.html',
      controller: 'StartCtrl as start'
    })
    .state('Play', {
      url: '/play',
      replace: true,
      templateUrl: 'main/templates/board.html',
      controller: 'BoardCtrl'
    });
  // TODO: do your thing
})
.service('categories', function () {
  var categories = [];
  
  return {
    getCategories: function () {
      return categories;
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
      if (categories.length == 0)
        return -1;
      return $.grep(categories, function(i, category) {
        if (category.name == inCategory) 
          return i;
        else
          return -1;
      })
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
