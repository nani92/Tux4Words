angular.module('main')
.controller('RootCtrl', function ($scope, categories, $state) {
  document.addEventListener('deviceready', function (event) {
    AndroidFullScreen.immersiveMode(successFunction, errorFunction);
  });
  var enableExercise = false;
  var numberOfNotLearnedWords = 12;
  var rootPath = 'main/assets/json/';
  ReadJSONPaths(categories);
  ReadWordsStatus();
  $scope.RandomWords = RandomNewWords;
  ShouldEnableExercises();
  /*************************************************************/
  /*             Reading in App Functions                      */
  /*************************************************************/
  function ReadJSONPaths() {
    var jsonURL =  rootPath + 'categories/files.json';
    $.getJSON(jsonURL, function (json) {
      $.each(json.paths, function (i, path) {
        ReadWords(path, categories);
      });
    });
  }
  function ReadWords(path) {
    var jsonURL = rootPath + 'categories/' + path;
    $.getJSON(jsonURL, function (json) {
      var id = categories.getCategoryId(json.category);
      if (id == -1) {
        id = categories.addCategory(json.category);
      }
      categories.addWordsToCategoryById(id, json.words);
    });
  }
  function ReadWordsStatus () {
    var jsonURL = rootPath + "wordStatus.json";
    $.getJSON(jsonURL, function (json) {
      categories.setWordsStatuts(json.wordState);
    });
  }
  /*************************************************************/
  /*                   Playing                                 */
  /*************************************************************/
  $scope.StartPlay = function () {
    $scope.isLastWord = false;
    $scope.isSessionStarted = true;
    words = categories.getAllWords();
    numberOfNotLearnedWords = categories.getAllNotLearnedForWords(words).length;
    wordsPerSession = Math.min(wordsPerSession, numberOfNotLearnedWords);
    if (wordsPerSession == 0 ) {
      alert("There is no words to learn");
    }
    else {
      RandomNewWords(categories.getAllNotLearnedForWords(words), wordsPerSession);
      wordIndex = 0;
      $scope.ShowNextBoard();
    }
  };
  $scope.ShowNextBoard = function () {
    $scope.currentImage = images[wordIndex];
    MarkWordAsLearned();
    ShouldEnableExercises();
    if (wordIndex == wordsPerSession - 1) {
      $scope.isLastWord = true;
    }
    $state.go('root.Play:num', {num: wordIndex});
    wordIndex++;
  }
  function MarkWordAsLearned() {
    categories.addStatusForWord($scope.currentImage.attr('id'));
  }
  /*************************************************************/
  /*                   Exercises                               */
  /*************************************************************/
  $scope.StartExercise = function (exercise, titleId) {
    $scope.isSessionStarted = false;
    $scope.exerciseTitleId = titleId;
    if ( enableExercise == false ) {
      alert("Cannot display exercise. You have to learn new words first");
      return;
    }
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
  function GetTasksTable () {
    tasks = [];
    for ( i = 0; i < images.length; i++) {
      tasks.push(i);
    }
    return tasks;
  }
  $scope.AddToCurrentTasks = function () {
    tasks.push(tasks[wordIndex]);
  }
  /*************************************************************/
  /*                   What is it?                             */
  /*************************************************************/
  $scope.WhatIsIt_Next = function () {
    if ($scope.lifes >= 0 && wordIndex < $scope.tasks.length - 1) {
      wordIndex++;
      WhatIsIt();
    }
    else {
      $state.go('root.What is it?');
    }
  }
  function WhatIsIt_Start () {
    $scope.lifes = 3;
    wordIndex = 0;
    $scope.points = 0;
    learnedWords = categories.getAllLearnedForWords(categories.getAllWords());
    GetWordsForExercises(learnedWords, Math.min(learnedWords.length, wordsPerSession));
    $scope.tasks = GetTasksTable();
    WhatIsIt();
  }
  function WhatIsIt () {
    $scope.currentImage = images[$scope.tasks[wordIndex]];
    $scope.labels = Shuffle(GetLabels([images[$scope.tasks[wordIndex]].attr('id')], categories.getAllWords(), 2));
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
    learnedWords = categories.getAllLearnedForWords(categories.getAllWords());
    if (learnedWords.length > 2) {
      RandomNewWords(learnedWords, 3);
      $scope.connectImages = images;
      $scope.labels = Shuffle(GetLabels(
         [images[0].attr('id'), images[1].attr('id'), images[2].attr('id')],
         categories.getAllWords(), 2));
      $state.go('root.Connect-Play:num', {num: wordIndex});
    }
    else {
      alert("Cannot display exercise. You have to learn new words first");
    }
  }
  /*************************************************************/
  /*                   Order the letters                       */
  /*************************************************************/
  $scope.Order_Next = function () {
    if ( $scope.lifes >= 0  && wordIndex < $scope.tasks.length - 1) {
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
    learnedWords = categories.getAllLearnedForWords(categories.getAllWords());
    GetWordsForExercises(learnedWords, Math.min(learnedWords.length, wordsPerSession));
    $scope.tasks = GetTasksTable();
    OrderTheLetters();
    
  }
  function OrderTheLetters () {
    $scope.currentImage = images[$scope.tasks[wordIndex]];
    $scope.letters = Shuffle(images[$scope.tasks[wordIndex]].attr('id').split(''));
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
    learnedWords = categories.getAllLearnedForWords(categories.getAllWords());
    if (learnedWords.length > 0 ) {
      RandomNewWords(learnedWords, 1);
      $scope.currentImage = images[0];
      keys = images[0].attr('id').split('');
      while (keys.length < 7) {
        keys = RandomLetter(keys);
      }
      $scope.keys = Shuffle(keys);
      $state.go('root.Type in-Play:num', {num: wordIndex});
    }
    else {
      alert("Cannot display exercise. You have to learn new words first");
    }
  }
  /*************************************************************/
  /*                        Helpers                            */
  /*************************************************************/
  var wordsPerSession = 3;
  var wordIndex;
  var isSessionStarted = false;
  function RandomNewWords(words, number) {
    images = [];
    RandomWords(words, number);
  }
  function RandomWords(words, number) {
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
  function GetWordsForExercises(words, number) {
    statusWords = categories.getLearnedWordsByStatus(words);
    console.log(statusWords);
    numbers = CountHowManyWhichWords(statusWords, number);
    images = [];
    RandomWords(statusWords.begin, numbers.begin);
    RandomWords(statusWords.good, numbers.good);
    RandomWords(statusWords.wrong, numbers.wrong);
    images = Shuffle(images);
  }
  function RandomLearnedWords(words, number) {
    images = [];
    tmpWords = [];
    learnedWords = categories.getAllLearnedWords();
    var n = number;
    while (n > 0) {
      var i = Math.floor(Math.random() * notLearnedWords.length);
      while (DoesLabelExists(words[notLearnedWords[i]].word, tmpWords )) {
        i = Math.floor(Math.random() * notLearnedWords.length);
      }
      tmpWords.push(words[notLearnedWords[i]].word);
      $.preloadImage(words[notLearnedWords[i]].imgPath, words[notLearnedWords[i]].word);
      n--;
    }
  }
  function RandomNotLearnedWords(words, number) {
    images = [];
    tmpWords = [];
    notLearnedWords = categories.getAllNotLearnedWords();
    var n = number;
    while (n > 0) {
      var i = Math.floor(Math.random() * notLearnedWords.length);
      while (DoesLabelExists(words[notLearnedWords[i]].word, tmpWords )) {
        i = Math.floor(Math.random() * notLearnedWords.length);
      }
      tmpWords.push(words[notLearnedWords[i]].word);
      $.preloadImage(words[notLearnedWords[i]].imgPath, words[notLearnedWords[i]].word);
      n--;
    }
  }
  var images = [];
  $.preloadImage = function () {
    images.push( $("<img />").attr("src", arguments[0]).attr("id", arguments[1]));
  }
  function ShouldEnableExercises() {
    if ( categories.getAllLearnedForWords(categories.getAllWords()).length > 3) {
      enableExercise = true;
    }
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
  function CountHowManyWhichWords (statusWords, totalNumber) {
    numbers = BaseNumbersOfWords(statusWords, totalNumber);
    var diff = totalNumber - (numbers.begin + numbers.good + numbers.wrong);
    while ( diff > 0 ) {
      if ( diff > 0 && numbers.begin < statusWords.begin.length ) {
        diff--;
        numbers.begin++;
      }
      if ( diff > 0 && numbers.wrong < statusWords.wrong.length ) {
        diff--;
        numbers.wrong++;
      }
      if ( diff > 0 && numbers.good < statusWords.good.length ) {
        diff--;
        numbers.good++;
      }
    }
    return numbers;
  }
  function BaseNumbersOfWords (statusWords, totalNumber) {
    numbers = {};
    numbers.begin = Math.min(Math.ceil(totalNumber / 4), statusWords.begin.length);
    numbers.good = Math.min(Math.ceil(totalNumber / 4), statusWords.good.length);
    numbers.wrong = Math.min(totalNumber - numbers.begin - numbers.good, statusWords.wrong.length);
    return numbers;
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
