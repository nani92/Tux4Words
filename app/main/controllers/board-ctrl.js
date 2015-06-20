//'use strict';

var taskNumbers = 12;
angular.module('main')
  .controller('BoardCtrl', function ($scope, $state, categories) {
    console.log('Inside Board');
    console.log($scope, $state);
    console.log(categories.getCategories());
    RandomWords(categories.getAllWords());
    $('#photoFrame').append(im[0]);
    $('#photoFrame').append('<span id=d' + im[0].attr('id').length + ' >' + im[0].attr('id'));
    var imgId = 1;
    $scope.ShowNextImage = function () {
      if (imgId == taskNumbers - 1) {
        $('#buttonNext').children('span:first').detach();
        $('#buttonNext').children('div:first').detach();
        $('#buttonNext').append('<span id=\'finish\'> Finish</span>');
      }
      if (imgId < taskNumbers) {
        Clear();
        $('#photoFrame').append(im[imgId]);
        $('#photoFrame').append('<span id=d' + im[imgId].attr('id').length + ' >' + im[imgId].attr('id'));
        imgId ++;
      }
      else {
        $state.go('root.main');
      }
    }
  });

var im = [];
$.preloadImage = function () {
  im.push( $("<img />").attr("src", arguments[0]).attr("id", arguments[1]));
}

function RandomWords(words) {
  var n = taskNumbers;
  while (n > 0) {
    var i = Math.floor(Math.random() * words.length);
    $.preloadImage(words[i].imgPath, words[i].word);
    n--;
  }
}

function Clear() {
  $('#photoFrame').children('img:first').detach();
  $('#photoFrame').children('span:first').detach();
}

