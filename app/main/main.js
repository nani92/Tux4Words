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
.service('sharedData', function () {
  var categories = [];
  return {
    getCategories: function () {
      return categories;
    },
    setCategories: function (value) {
      categories = value;
    },
    addCategory: function (category) {
      categories.push(category);
      console.log(category);
    },
    isCategory: function (category) {
      //TODO
    }
  };
});
