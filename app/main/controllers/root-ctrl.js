angular.module('main')
.controller('RootCtrl', function ($scope, categories, $state) {
  document.addEventListener('deviceready', function (event) {
    AndroidFullScreen.immersiveMode(successFunction, errorFunction);
  });
  var rootPath = 'main/assets/json/categories/';
  ReadJSONPaths(categories);
  $scope.RandomWords = RandomWords;
  /*************************************************************/
  /*             Reading in App Functions                      */
  /*************************************************************/
  function ReadJSONPaths() {
    var jsonURL =  rootPath + 'files.json';
    $.getJSON(jsonURL, function (json) {
      $.each(json.paths, function (i, path) {
        ReadWords(path, categories);
      });
    });
  }
  function ReadWords(path) {
    var jsonURL = rootPath + path;
    $.getJSON(jsonURL, function (json) {
      var id = categories.getCategoryId(json.category);
      if (id == -1) {
        id = categories.addCategory(json.category);
      }
      categories.addWordsToCategoryById(id, json.words);
    });
  }
  /*************************************************************/
  /*                   Playing                                 */
  /*************************************************************/
  $scope.StartPlay = function () {
    $scope.isLastWord = false;
    $scope.isSessionStarted = true;
    RandomWords(categories.getAllWords(), wordsPerSession);
    wordIndex = 0;
    $scope.currentImage = images[wordIndex];
    $state.go("root.Play:num", {num: wordIndex});
  };
  $scope.ShowNextBoard = function () {
    wordIndex++;
    $scope.currentImage = images[wordIndex];
    if (wordIndex == wordsPerSession - 1) {
      $scope.isLastWord = true;
    }
    $state.go('root.Play:num', {num: wordIndex});
  }
  /*************************************************************/
  /*                   Exercises                               */
  /*************************************************************/
  $scope.StartExercise = function (exercise, titleId) {
    $scope.exerciseTitleId = titleId;
    if (exercise === "What is it?") {
      WhatIsIt_Start();
    }
    if (exercise === "Connect") {
      $scope.connectImages = [];
      Connect_Start();
    }
    if (exercise === "Order the letters") {
      OrderTheLetters_Start();
    }
    if (exercise === "Type in") {
      TypeIn_Start();
    }
  }
  var exerciseState;
  $scope.ShowProperBoard = function () {
    exerciseState = $state.$current;
    $scope.isLastWord = true;
    $state.go('root.Play:num', {num: 0});
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
  /*************************************************************/
  /*                   What is it?                             */
  /*************************************************************/
  $scope.WhatIsIt_Next = function () {
    if ($scope.lifes >= 0) {
      wordIndex++;
      WhatIsIt($scope, $state, categories);
    }
    else {
      $state.go('root.What is it?');
    }
  }
  function WhatIsIt_Start () {
    $scope.lifes = 3;
    wordIndex = 0;
    $scope.points = 0;
    WhatIsIt();
  }
  function WhatIsIt () {
    RandomWords(categories.getAllWords(), 1);
    $scope.currentImage = images[0];
    $scope.labels = Shuffle(GetLabels([images[0].attr('id')], categories.getAllWords(), 2));
    $state.go('root.What is it?-Play:num', {num: wordIndex});
  }
  /*************************************************************/
  /*                   Connect                                 */
  /*************************************************************/
  $scope.Connect_Next = function () {
    wordIndex++;
    Connect($scope, $state, categories);
  }
  function Connect_Start () {
    $scope.lifes = 3;
    wordIndex = 0;
    $scope.points = 0;
    Connect();
  }
  function Connect () {
    RandomWords(categories.getAllWords(), 3);
    $scope.connectImages = images;
    $scope.labels = Shuffle(GetLabels(
       [images[0].attr('id'), images[1].attr('id'), images[2].attr('id')],
       categories.getAllWords(), 2));
    $state.go('root.Connect-Play:num', {num: wordIndex});
  }
  /*************************************************************/
  /*                   Order the letters                       */
  /*************************************************************/
  $scope.Order_Next = function () {
    if ( $scope.lifes >= 0 ) {
      wordIndex++;
      OrderTheLetters();
    }
    else {
      $state.go('root.Order the letters');
    }
  }
  function OrderTheLetters_Start () {
    $scope.lifes = 3;
    wordIndex = 0;
    $scope.points = 0;
    OrderTheLetters();
  }
  function OrderTheLetters () {
    RandomWords(categories.getAllWords(), 1);
    $scope.currentImage = images[0];
    $scope.letters = Shuffle(images[0].attr('id').split(''));
    $scope.frames = [];
    $.each($scope.letters, function (key, value) {
      $scope.frames.push(key);
    });
    $state.go('root.Order the letters-Play:num', {num: wordIndex});
  }
  /*************************************************************/
  /*                     Type in                               */
  /*************************************************************/
  $scope.TypeIn_Next = function () {
    if ( $scope.lifes >= 0 ) {
      wordIndex++;
      TypeIn();
    }
    else {
      $state.go('root.Type in');
    }
  }
  function TypeIn_Start () {
    $scope.lifes = 3;
    wordIndex = 0;
    $scope.points = 0;
    TypeIn($scope, $state, categories);
  }
  function TypeIn () {
    RandomWords(categories.getAllWords(), 1);
    $scope.currentImage = images[0];
    keys = images[0].attr('id').split('');
    while (keys.length < 7) {
      keys = RandomLetter(keys);
    }
    $scope.keys = Shuffle(keys);
    $state.go('root.Type in-Play:num', {num: wordIndex});
  }
  /*************************************************************/
  /*                        Helpers                            */
  /*************************************************************/
  var wordsPerSession = 3;
  var wordIndex;
  var isSessionStarted = false;
  function RandomWords(words, number) {
    images = [];
    tmpWords = [];
    var n = number;
    while (n > 0) {
      var i = Math.floor(Math.random() * words.length);
      while (DoesLabelExists(words[i].word, tmpWords )) {
        i = Math.floor(Math.random() * words.length);
      }
      tmpWords.push(words[i].word);
      $.preloadImage(words[i].imgPath, words[i].word);
      n--;
    }
  }
  var images = [];
  $.preloadImage = function () {
    images.push( $("<img />").attr("src", arguments[0]).attr("id", arguments[1]));
  }

  function GetLabels (inLabels, words, number) {
    var labels = inLabels;
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

  function Shuffle(array) {
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

  function RandomLetter (letters) {
    var letter_set = "qwertyuiopasdfghjklzxcvbnm";
    var i = Math.floor(Math.random() * letter_set.length);
    while (DoesLabelExists(letter_set.substring(i, i + 1), letters)) {
      i = Math.floor(Math.random() * letter_set.length);
    }
    letters.push(letter_set.substring(i, i + 1));
    return letters;
  }
});

function ShowLifes($scope) {
  for (i = 3; i > 0; i--) {
    if ($scope.lifes < i ) {
      $('#' + i.toString() + 'life').attr('class', 'dead');
    }
  }
}
function successFunction() {
  console.log("It worked!");
}
function errorFunction(error) {
  console.log(error);
}
