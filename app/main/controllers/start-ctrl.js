'use strict';
var rootPath = 'main/assets/json/categories/';

function ReadJSONPaths(categories) {
  var jsonURL =  rootPath + 'files.json';
  $.getJSON(jsonURL, function (json) {
    $.each(json.paths, function (i, path) {
      ReadWords(path, categories);
    });
  });
}

function ReadWords(path, categories) {
  var jsonURL = rootPath + path;
  $.getJSON(jsonURL, function (json) {
    var id = categories.getCategoryId(json.category);
    if (id == -1) {
      id = categories.addCategory(json.category);
    }
    categories.addWordsToCategoryById(id, json.words);
  });
}

angular.module('main')
.controller('StartCtrl', function (Start, Config, $scope, $state, categories, $location, $window) {

  // bind data from service
  this.someData = Start.someData;
  this.ENV = Config.ENV;
  this.BUILD = Config.BUILD;

  console.log('Hello from your Controller: StartCtrl in module main:. This is your controller:', this);
  // TODO: do your controller thing
  ReadJSONPaths(categories);
  $scope.basicOptions = ['Play', 'Categories'];
  $scope.exerciseOptions = ['What is it?', 'Connect', 'Order the letters', 'Type in'];
  $scope.MoveTo = function (option, name) {
    $state.go(name);
    console.log(name);
  };
});
