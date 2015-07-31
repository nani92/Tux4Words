//'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'infinite-scroll'
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
    .state('root.Play:num', {
      url: 'play/:num',
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
    .state('root.What is it?-Play:num', {
      displayName: 'What is it?',
      url: 'whatIsIt/play/:num',
      replace: true,
      templateUrl: 'main/templates/exercise.whatisit.play.html',
      controller: 'WhatIsItCtrl'
    })
    .state('root.Connect', {
      displayName: 'Connect',
      url: 'connect/',
      replace: true,
      templateUrl: 'main/templates/exercises.mainScreen.html',
      controller: 'ExerciseCtrl'
    })
    .state('root.Connect-Play:num', {
      displayName: 'Connect',
      url: 'connect/play/:num',
      replace: true,
      templateUrl: 'main/templates/exercise.connect.play.html',
      controller: 'ConnectCtrl'
    })
    .state('root.Order the letters', {
      displayName: 'Order the letters',
      url: 'orderTheLetters/',
      replace: true,
      templateUrl: 'main/templates/exercises.mainScreen.html',
      controller: 'ExerciseCtrl'
    })
    .state('root.Order the letters-Play:num', {
      displayName: 'Order the letters',
      url: 'orderTheLetters/play/:num',
      replace: true,
      templateUrl: 'main/templates/exercise.ordertheletters.play.html',
      controller: 'OrderTheLettersCtrl'
    })
    .state('root.Type in', {
      displayName: 'Type in',
      url: 'typeIn/',
      replace: true,
      templateUrl: 'main/templates/exercises.mainScreen.html',
      controller: 'ExerciseCtrl'
    })
    .state('root.Type in-Play:num', {
      displayName: 'Type in',
      url: 'typeIn/play:num',
      replace: true,
      templateUrl: 'main/templates/exercise.typein.play.html',
      controller: 'TypeInCtrl'
    })
    .state('root.history', {
      url: 'history',
      replace: true,
      templateUrl: 'main/templates/history.html',
      controller: 'HistoryCtrl'
    })
    .state('root.Leaderboards', {
      url: 'leaderboards',
      replace: true,
      templateUrl: 'main/templates/leaderboard.html',
      controller: 'LeaderboardCtrl'
    })
    .state('root.Categories', {
      url: 'categories',
      replace: true,
      templateUrl: 'main/templates/categories.html',
      controller: 'CategoriesCtrl'
    });
})
.service('categories', function () {
  var categories = [];
  var wordStatus = {};
  var allWords = [];
  function isWordLearned (inWord) {
    isLearned = false;
    $.each(wordStatus, function (i, word) {
      if (Object.keys(word)[0] === inWord.word) {
        isLearned = true;
      }
    });
    return isLearned;
  }
  function AreArraysTheSame(arr, arr2) {
    same = true;
    if ( arr.length != arr2.length ) {
      return false;
    }
    $.each(arr, function (i, word) {
      if (arr[i] != arr2[i]) {
        same = false;
      }
    });
    return same;
  }
  function CheckStatus (inWord) {
    var id;
    $.each(wordStatus, function ( i, word) {
      if (Object.keys(word)[0] === inWord) {
        id = i;
      }
    });
    state = wordStatus[id][inWord];
    if (AreArraysTheSame(state, [false, false, false, true, true]) ||
        AreArraysTheSame(state, [false, false, true, true, true])) {
      return "begin";
    } else if (AreArraysTheSame(state, [false, true, true, true, true]) ||
              AreArraysTheSame(state, [true, true, true, true, true]) ||
              AreArraysTheSame(state, [true, true, true, false, true]) ||
              AreArraysTheSame(state, [true, true, false, true, true]) ||
              AreArraysTheSame(state, [true, false, true, true, true]) ||
              AreArraysTheSame(state, [true, false, true, false, true]) ||
              AreArraysTheSame(state, [false, true, false, true, true])) {
      return "good";
    } else {
      return "wrong";
    }
  }
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
      var id = -1;
      $.each(categories, function (key, value) {
        if (value.name === inCategory) {
          id = key;
        }
      });
      return id;
    },
    setWordsToCategoryById: function (inId, inWords) {
      categories[inId].words = inWords;
    },
    addWordsToCategoryById: function (inId, inWords) {
      $.merge(categories[inId].words, inWords);
    },
    getWordsFromCategoryById: function (inId) {
      return categories[inId].words;
    },
    getLearnedWordsFromCategoryById: function (inId) {
      words = [];
      categoryWords = categories[inId].words;
      $.each(categoryWords, function (i, word) {
        if (isWordLearned(word)) {
          words.push(word);
        }
      });
      return words;
    },
    getAllWords: function () {
      if (allWords.length == 0) {
        $.each(categories, function (i, category) {
          $.merge(allWords, category.words);
        });
      }
      return allWords;
    },
    setWordsStatuts: function (inWordStatus) {
      wordStatus = inWordStatus;
    },
    getListOfLearnedWords: function () {
      var words = [];
      $.each(wordStatus, function (i, word) {
        words.push(Object.keys(word)[0]);
      });
      return words;
    },
    getAllLearnedForWords: function (inWords) {
      learned = [];
      $.each(inWords, function (i, word) {
        if (isWordLearned(word)) {
          learned.push(word);
        }
      });
      return learned;
    },
    getStatusForWord: function (word) {
      return wordStatus[word];
    },
    getAllNotLearnedForWords: function (inWords) {
      notLearned = [];
      $.each(inWords, function (i, word) {
        if (!isWordLearned(word)) {
          notLearned.push(word);
        }
      });
      return notLearned;
    },
    addStatusForWord: function (inWord) {
      var tmp = {};
      tmp[inWord] = [false, false, false, true, true];
      wordStatus.push(tmp);
    },
    changeStatusForWord: function (inWord, inStatus) {
      wordStatus[inWord] = inStatus;
    },
    increaseStatusOfWord: function (inWord) {
      $.each(wordStatus, function ( i, word) {
        if (Object.keys(word)[0] === inWord) {
          id = i;
        }
      });
      wordStatus[id][inWord].shift();
      wordStatus[id][inWord].push(true);
    },
    decreaseStatusOfWord: function (inWord) {
      $.each(wordStatus, function ( i, word) {
        if (Object.keys(word)[0] === inWord) {
          id = i;
        }
      });
      wordStatus[id][inWord].shift();
      wordStatus[id][inWord].push(false);
    },
    getLearnedWordsByStatus: function (inWords) {
      outWords = {};
      outWords.begin = [];
      outWords.good = [];
      outWords.wrong = [];
      $.each(inWords, function (i, word) {
        outWords[CheckStatus(word.word)].push(word);
      });
      return outWords;
    },
    isWordLearned: isWordLearned
  };
})
.service('leaders', function () {
  var whatIsIt = [],
      connect = [],
      orderTheLetters = [],
      typeIn = [];
  return {
    setWhatIsItLeaders: function (inWhatIsIt) {
      console.log(inWhatIsIt);
      whatIsIt = inWhatIsIt;
    },
    setConnectLeaders: function (inConnect) {
      connect = inConnect;
    },
    setOrderTheLettersLeaders: function (inOrderTheLetters) {
      orderTheLetters = inOrderTheLetters;
    },
    setTypeInLeaders: function (inTypeIn) {
      typeIn = inTypeIn;
    },
    getWhatIsItLeaders: function () {
      return whatIsIt;
    },
    getConnectLeaders: function () {
      return connect;
    },
    getOrderTheLettersLeaders: function () {
      return orderTheLetters;
    },
    getTypeInLeaders: function () {
      return typeIn;
    },
    addWhatIsItResult: function (inResult) {
      if (whatIsIt.length == 0) {
        whatIsIt.push(inResult);
      }
      for ( i = 0; i < whatIsIt.length ; i++) {
        if ( inResult.points > whatIsIt[i].points ) {
          whatIsIt.splice(i, 0, inResult);
          break;
        }
      }
      whatIsIt.slice(0, 10);
    },
    addConnectResult: function (inResult) {
      if (connect.length == 0) {
        connect.push(inResult);
      }
      for ( i = 0; i < connect.length ; i++) {
        if ( inResult.points > connect[i].points ) {
          connect.splice(i, 0, inResult);
          break;
        }
      }
      connect.slice(0, 10);
    },
    addOrderTheLettersResult: function (inResult) {
      if (orderTheLetters.length == 0) {
        orderTheLetters.push(inResult);
      }
      for ( i = 0; i < orderTheLetters.length ; i++) {
        if ( inResult.points > orderTheLetters[i].points ) {
          orderTheLetters.splice(i, 0, inResult);
          break;
        }
      }
      orderTheLetters.slice(0, 10);
    },
    addTypeInResult: function (inResult) {
      if (typeIn.length == 0) {
        typeIn.push(inResult);
      }
      for ( i = 0; i < typeIn.length ; i++) {
        if ( inResult.points > typeIn[i].points ) {
          typeIn.splice(i, 0, inResult);
          break;
        }
      }
      typeIn.slice(0, 10);
    }
  }
});
