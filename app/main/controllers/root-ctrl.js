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

function GetLabels (label, words, number) {
  var labels = [];
  labels.push(label);
  while (number > 0) {
    number--;
    var i = Math.floor(Math.random() * words.length);
    while (DoesLabelExists(words[i].word, labels)) {
      i = Math.floor(Math.random() * words.length);
    }
    labels.push(words[i].word);
  }
  return labels;
}

function DoesLabelExists(word, labels) {
  var exist = false;
  $.each(labels, function (index, value) {
    if (value === word) {
      exist = true;
    }
  });
  return exist;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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
    $scope.isSessionStarted = true;
    RandomWords(categories.getAllWords(), wordsPerSession);
    wordIndex = 0;
    $scope.currentImage = images[wordIndex];
    $state.go("root.Play:num", {num: wordIndex});
  };
  $scope.ShowNextBoard = function () {
    wordIndex++;
    $scope.currentImage = images[wordIndex];
    if (isSessionStarted && wordIndex == wordsPerSession - 1) {
      $scope.isLastWord = true;
    }
    $state.go('root.Play:num', {num: wordIndex});
  }
  $scope.EndSession = function () {
    $scope.isSessionStarted = false;
  }
  $scope.StartExercise = function (exercise) {
    if (exercise === "What is it?") {
      WhatIsIt_Start($scope, $state, categories);
    }
  }
  $scope.WhatIsIt_Next = function () {
    if ($scope.lifes >= 0) {
      wordIndex++;
      WhatIsIt($scope, $state, categories);
    }
    else {
      $state.go('root.What is it?');
    }
  }
  var exerciseState;
  $scope.ShowProperBoard = function () {
    console.log("show proper");
    exerciseState = $state.$current;
    $scope.isLastWord = true;
    $state.go('root.Play:num', {num: 0});
    console.log("SHOWED");
  }
  $scope.BackToExercise = function () {
    $scope.WhatIsIt_Next();
  }
  $scope.SetPoints = function (inPoints) {
    $scope.points = inPoints;
  }
  $scope.SetLifes = function (inLifes) {
    $scope.lifes = inLifes;
  }
});
function WhatIsIt_Start ($scope, $state, categories) {
  $scope.lifes = 3;
  wordIndex = 0;
  $scope.points = 0;
  WhatIsIt($scope, $state, categories);
}
function WhatIsIt ($scope, $state, categories) {
  RandomWords(categories.getAllWords(), 1);
  $scope.currentImage = images[wordIndex];
  $scope.labels = shuffle(GetLabels(images[wordIndex].attr('id'), categories.getAllWords(), 2));
  $state.go('root.What is it?-Play:num', {num: wordIndex});
}
