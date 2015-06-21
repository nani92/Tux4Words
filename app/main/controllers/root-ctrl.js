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

function RandomWords(words, number) {
  console.log("Random Words");
  var n = number;
  while (n > 0) {
    var i = Math.floor(Math.random() * words.length);
    $.preloadImage(words[i].imgPath, words[i].word);
    n--;
  }
}

var images = [];
$.preloadImage = function () {
  images.push( $("<img />").attr("src", arguments[0]).attr("id", arguments[1]));
}

var wordsPerSession = 12;
var wordIndex;
var isSessionStarted = false;

angular.module('main')
.controller('RootCtrl', function ($scope, categories, $state) {
  console.log("RootCtrl");
  ReadJSONPaths(categories);
  $scope.RandomWords = RandomWords;
  $scope.isLastWord = false;
  $scope.StartPlay = function () {
    isSessionStarted = true;
    RandomWords(categories.getAllWords(), wordsPerSession);
    wordIndex = 0;
    $scope.currentImage = images[wordIndex];
    $state.go("root.Play:num", {num: wordIndex});
  };
  $scope.ShowNextBoard = function () {
    console.log("Next board");
    wordIndex++;
    $scope.currentImage = images[wordIndex];
    if (isSessionStarted && wordIndex == wordsPerSession - 1) {
      $scope.isLastWord = true;
    }
    $state.go("root.Play:num", {num: wordIndex});
  }
});
