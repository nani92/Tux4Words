angular.module('main')
.directive('onLastRepeat', function () {
  return function (scope, element, attrs) {
    if (scope.$last) {
      setTimeout(function () {
      scope.$emit('onRepeatLast', element, attrs);
    }, 1);
    }
  };
})
.controller('RootCtrl', function ($scope, categories, $state, leaders, tests) {
  document.addEventListener('deviceready', function (event) {
    AndroidFullScreen.immersiveMode(successFunction, errorFunction);
  });
  var enableExercise = false;
  var numberOfNotLearnedWords = 12;
  var rootPath = 'main/assets/json/';
  ReadJSONPaths(categories);
  ReadWordsStatus();
  ReadLeaderBoards();
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
  function ReadLeaderBoards () {
    $.getJSON(rootPath + 'leaderboards/whatisit.json', function (json) {
      leaders.setWhatIsItLeaders(json.rank);
    });
    $.getJSON(rootPath + 'leaderboards/connect.json', function (json) {
      leaders.setConnectLeaders(json.rank);
    });
    $.getJSON(rootPath + 'leaderboards/order.json', function (json) {
      leaders.setOrderTheLettersLeaders(json.rank);
    });
    $.getJSON(rootPath + 'leaderboards/typein.json', function (json) {
      leaders.setTypeInLeaders(json.rank);
    });
  }
  /*************************************************************/
  /*                   Playing                                 */
  /*************************************************************/
  $scope.StartPlay = function () {
    $scope.isLastWord = false;
    $scope.isSessionStarted = true;
    words = categories.getAllWords();
    LearnWithWords(words);
  };
  function LearnWithWords (words) {
    numberOfNotLearnedWords = categories.getAllNotLearnedForWords(words).length;
    if ( Math.min(wordsPerSession, numberOfNotLearnedWords) == 0 ) {
      alert("There is no words to learn");
    }
    else {
      RandomNewWords(categories.getAllNotLearnedForWords(words), wordsPerSession);
      wordIndex = 0;
      $scope.ShowNextBoard();
    }
  }
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
  $scope.SetExerciseState = function () {
    $scope.exerciseState = $state.$current.name;
  }
  $scope.ClearExerciseState = function () {
    $scope.exerciseState = "";
  }
  $scope.EndSession = function () {
    $scope.isSessionStarted = false;
  }
  $scope.StartExercise = function (exercise, titleId) {
    $scope.isSessionStarted = false;
    $scope.exerciseTitleId = titleId;
    if ( enableExercise == false ) {
      alert("Cannot display exercise. You have to learn new words first.");
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
  $scope.ShowProperBoard = function () {
    $scope.isLastWord = true;
    $state.go('root.Play:num', {num: wordIndex});
  }
  $scope.BackToExercise = function () {
    if ($scope.exerciseState.indexOf("What is it?") >= 0) {
      $scope.WhatIsIt_Next();
    }
    else if ($scope.exerciseState.indexOf("Order the letters") >= 0) {
      $scope.Order_Next();
    }
    else if ($scope.exerciseState.indexOf("Type in") >= 0) {
      $scope.TypeIn_Next();
    }
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
  $scope.AddToCurrentTasks = function (connectId) {
    connectId = connectId || 0;
    tasks.push(tasks[wordIndex + connectId]);
  }
  $scope.GoHome = function () {
    $state.go('root.main');
  }
  var userName = "";
  function EndExercise () {
    DisplayFinishingPrompt();
    AddResult(GetResultObject());
  }
  function DisplayFinishingPrompt () {
    userName = prompt("You scored " + $scope.points +
                      " points. \nPlease enter Your name.", "name");
  }
  function GetResultObject () {
    var result = {};
    result.name = userName;
    result.points = $scope.points;
    return result;
  }
  function AddResult (inResult) {
    if ($scope.exerciseState.indexOf("What is it?") >= 0) {
      leaders.addWhatIsItResult(inResult);
    }
    else if ($scope.exerciseState.indexOf("Connect") >= 0) {
      leaders.addConnectResult(inResult);
    }
    else if ($scope.exerciseState.indexOf("Order the letters") >= 0) {
      leaders.addOrderTheLettersResult(inResult);
    }
    else if ($scope.exerciseState.indexOf("Type in") >= 0) {
      leaders.addTypeInResult(inResult);
    }
  }
  function InitExercise() {
    $scope.lifes = 3;
    wordIndex = 0;
    $scope.points = 0;
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
      EndExercise();
      $state.go('root.What is it?');
    }
  }
  function WhatIsIt_Start () {
    InitExercise();
    learnedWords = categories.getAllLearnedForWords(categories.getAllWords());
    WhatIsIt_StartWithWords(learnedWords);
  }
  function WhatIsIt_StartWithWords (learnedWords) {
    GetWordsForExercises(learnedWords, Math.min(learnedWords.length, wordsPerExerciseSession));
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
    if ( $scope.lifes >= 0 && wordIndex + 3 < $scope.tasks.length) {
      wordIndex += 3;
      RemoveDuplicatesConnectTasks();
      if ( wordIndex + 2 < $scope.tasks.length ) {
      } else {
        if ( wordIndex + 1 >= $scope.tasks.length ) {
          MultiplyOneConnectTask();
        }
        MultiplyOneConnectTask();
      }
      Connect();
    }
    else {
      EndExercise ();
      $state.go('root.Connect');
    }
  }
  function Connect_Start () {
    InitExercise();
    learnedWords = categories.getAllLearnedForWords(categories.getAllWords());
    Connect_StartWithWords(learnedWords);
  }
  function Connect_StartWithWords (learnedWords) {
    GetWordsForExercises(learnedWords, Math.min(learnedWords.length, wordsPerExerciseSession));
    $scope.tasks = GetTasksTable();
    Connect();
  }
  function Connect () {
    $scope.connectImages = GetConnectImages();
    $scope.labels = Shuffle(GetLabels(
      [$scope.connectImages[0].attr('id'), $scope.connectImages[1].attr('id'), $scope.connectImages[2].attr('id')],
      categories.getAllWords(), 2));
    $state.go('root.Connect-Play:num', {num: wordIndex});
  }
  function GetConnectImages () {
    connectImages = [];
    for ( i = 0; i < 3 ; i++) {
      connectImages.push(images[$scope.tasks[wordIndex + i]]);
    }
    return connectImages;
  }
  function MultiplyOneConnectTask() {
    var needToAdd = true;
    i = 0;
    while (needToAdd && i < $scope.tasks.length) {
      if ($scope.tasks.length > wordIndex + 1) {
        if ( $scope.tasks[i] != $scope.tasks[wordIndex] && $scope.tasks[i] != $scope.tasks[wordIndex + 1]) {
          $scope.tasks.push($scope.tasks[i]);
          needToAdd = false;
        }
      }
      else {
        if ( $scope.tasks[i] != $scope.tasks[wordIndex] ) {
          $scope.tasks.push($scope.tasks[i]);
          needToAdd = false;
        }
      }
      i++;
    }
  }
  function RemoveDuplicatesConnectTasks() {
    if ( $scope.tasks.length > wordIndex + 2 ) {
      if ($scope.tasks[wordIndex + 2] === $scope.tasks[wordIndex] || $scope.tasks[wordIndex + 2] === $scope.tasks[wordIndex + 1]) {
        $scope.tasks.splice(wordIndex + 2, 1);
      }
    }
    if ( $scope.tasks.length > wordIndex + 1 ) {
      if ($scope.tasks[wordIndex + 1] === $scope.tasks[wordIndex]) {
        $scope.tasks.splice(wordIndex + 1, 1);
      }
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
      EndExercise ();
      $state.go('root.Order the letters');
    }
  }
  function OrderTheLetters_Start () {
    InitExercise();
    learnedWords = categories.getAllLearnedForWords(categories.getAllWords());
    OrderTheLetters_StartWithWords(learnedWords);
  }
  function OrderTheLetters_StartWithWords (learnedWords) {
    GetWordsForExercises(learnedWords, Math.min(learnedWords.length, wordsPerExerciseSession));
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
    if ( $scope.lifes >= 0 && wordIndex < $scope.tasks.length - 1 ) {
      wordIndex++;
      TypeIn();
    }
    else {
      EndExercise ();
      $state.go('root.Type in');
    }
  }
  function TypeIn_Start () {
    InitExercise();
    learnedWords = categories.getAllLearnedForWords(categories.getAllWords());
    TypeIn_StartWithWords(learnedWords);
  }
  function TypeIn_StartWithWords (learnedWords) {
    GetWordsForExercises(learnedWords, Math.min(learnedWords.length, wordsPerExerciseSession));
    $scope.tasks = GetTasksTable();
    TypeIn($scope, $state, categories);
  }
  function TypeIn () {
    $scope.currentImage = images[$scope.tasks[wordIndex]];
    keys = images[$scope.tasks[wordIndex]].attr('id').split('');
    keys = RemoveDuplicatesInArray(keys);
    while (keys.length < 7) {
      keys = RandomLetter(keys);
    }
    $scope.keys = Shuffle(keys);
    $state.go('root.Type in-Play:num', {num: wordIndex});
  }
  /*************************************************************/
  /*                     Categories                            */
  /*************************************************************/
  $scope.StartCategory = function (inCategory) {
    $scope.isLastWord = false;
    $scope.isSessionStarted = true;
    words = categories.getWordsFromCategoryById(categories.getCategoryId(inCategory));
    LearnWithWords(words);
  };
  $scope.StartCategory_WhatIsIt = function (inCategory) {
    InitExercise();
    words = categories.getLearnedWordsFromCategoryById(categories.getCategoryId(inCategory));
    if ( IsPossibleToExerciseThisCategory(words)) {
      WhatIsIt_StartWithWords(words);
    }
    else {
      DisplayInfoAboutUnableCategory(inCategory);
    }
  }
  $scope.StartCategory_Connect = function (inCategory) {
    InitExercise();
    words = categories.getLearnedWordsFromCategoryById(categories.getCategoryId(inCategory));
    if ( IsPossibleToExerciseThisCategory(words)) {
      Connect_StartWithWords(words);
    }
    else {
      DisplayInfoAboutUnableCategory(inCategory);
    }
  }
  $scope.StartCategory_OrderTheLetters = function (inCategory) {
    InitExercise();
    words = categories.getLearnedWordsFromCategoryById(categories.getCategoryId(inCategory));
    if ( IsPossibleToExerciseThisCategory(words)) {
      OrderTheLetters_StartWithWords(words);
    }
    else {
      DisplayInfoAboutUnableCategory(inCategory);
    }
  }
  $scope.StartCategory_TypeIn = function (inCategory) {
    InitExercise();
    words = categories.getLearnedWordsFromCategoryById(categories.getCategoryId(inCategory));
    if ( IsPossibleToExerciseThisCategory(words)) {
      TypeIn_StartWithWords(words);
    }
    else {
      DisplayInfoAboutUnableCategory(inCategory);
    }
  }
  function IsPossibleToExerciseThisCategory (words) {
    console.log(words);
    if (words.length > 2) {
      return true;
    }
    return false;
  }
  function DisplayInfoAboutUnableCategory (category) {
    alert("Cannot display exercise for " + category + ". You have to learn new words first.");
  }
  /*************************************************************/
  /*                     Playing test                          */
  /*************************************************************/
  $scope.StartTest_WhatIsIt = function (inTest) {
    InitExercise();
    console.log(inTest);
    words = inTest.words; 
    if ( IsPossibleToExerciseThisCategory(words)) {
      WhatIsIt_StartWithWords(words);
    }
    else {
      DisplayInfoAboutUnableCategory(inTest);
    }
  }
  $scope.StartTest_Connect = function (inTest) {
    InitExercise();
    words = inTest.words;
    if ( IsPossibleToExerciseThisCategory(words)) {
      Connect_StartWithWords(words);
    }
    else {
      DisplayInfoAboutUnableCategory(inTest);
    }
  }
  $scope.StartTest_OrderTheLetters = function (inTest) {
    InitExercise();
    words = inTest.words;
    if ( IsPossibleToExerciseThisCategory(words)) {
      OrderTheLetters_StartWithWords(words);
    }
    else {
      DisplayInfoAboutUnableCategory(inTest);
    }
  }
  $scope.StartTest_TypeIn = function (inTest) {
    InitExercise();
    words = inTest.words;
    if ( IsPossibleToExerciseThisCategory(words)) {
      TypeIn_StartWithWords(words);
    }
    else {
      DisplayInfoAboutUnableCategory(inTest);
    }
  }
  /*************************************************************/
  /*                        Helpers                            */
  /*************************************************************/
  var wordsPerSession = 3;
  var wordsPerExerciseSession = 12;
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
  function RemoveDuplicatesInArray(array) {
    var newArray = [];
    $.each(array, function (key, value) {
      if ($.inArray(value, newArray) === -1) {
        newArray.push(value);
      }
    });
    return newArray;
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

function win (writer) {
  writer.onwrite = function (evt) {
    console.log("write success");
  };
  writer.write("some sample text");
};

var fail = function (evt) {
  console.log(error.code);
};

entry.createWriter(win, fail);
