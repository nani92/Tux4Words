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
.controller('ConnectCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  AppendImages($scope);
  ShowLifes($scope);
  $scope.$on('onRepeatLast', function (scope, element, attrs) {
    AddDraggable($scope);
    AddDroppable();
  });
  $scope.CorrectAnswer = function CorrectAnswer (imageId) {
    DisplayFrameAsSolved($('#' + imageId).parent());
    DisplayLabelAsSolved(imageId);
    $scope.$apply ( function () {
      $scope.SetPoints($scope.points + 10);
    });
    if (HowManySolved() == 3) {
      $scope.Connect_Next();
    }
  }
  $scope.LostGame = function LostGame () {
    $state.go('root.Connect');
  }
});
function ShowLifes($scope) {
  for (i = 3; i > 0; i--) {
    if ($scope.lifes < i ) {
      $('#' + i.toString() + 'life').attr('class', 'dead');
    }
  }
}
function AppendImages($scope) {
  for ( i = 1 ; i <= 3 ; i++) {
    $('#PhotoFrame' + i.toString()).append($scope.connectImages[i - 1]);
  }
}
function AddDraggable ($scope) {
  $('.label_button').each( function () {
    $(this).draggable({
      start: function () {},
      drag: function () {
        IsOnImage($(this));
      },
      revert: function () {
        if (IsOnImage($(this)) && IsOnCorrectImage($(this), $scope) ) {
          return false;
        }
        return true;
      },
      stop: function () {
        ClearDisplayingAsWrongOrActive();
      }
    });
  });
}
function AddDroppable () {
  $('.photoFrame').each(function () {
    $(this).droppable();
  });
}
function IsOnImage(word) {
  droppedOnImage = false;
  $('.photoFrame').each(function () {
    if (IsWordRightEdgeAfterImageLeftEdge(word, $(this)) &&
					IsWordLeftEdgeBeforeImageRightEdge(word, $(this)) &&
					IsWordTopEdgeAboveImageBottomEdge(word, $(this)) &&
					IsWordBottomEdgeBelowImageTopEdge(word, $(this))) {
      droppedOnImage = true;
      HighlightImageDiv($(this));
    }
    else {
      UnHighlightImageDiv($(this));
    }
  });
  return droppedOnImage;
}

function IsWordRightEdgeAfterImageLeftEdge(word, pic) {
  return (word.offset().left + word.width()) > pic.offset().left;
}

function IsWordLeftEdgeBeforeImageRightEdge(word, pic) {
  return word.offset().left < (pic.offset().left + pic.width());
}

function IsWordTopEdgeAboveImageBottomEdge(word, pic) {
  return (word.offset().top + word.height() / 3) < (pic.offset().top + (pic.height()));
}

function IsWordBottomEdgeBelowImageTopEdge(word, pic) {
  return (word.offset().top + word.height() * 2 / 3) > pic.offset().top;
}

function HighlightImageDiv(pic) {
  pic.addClass('active');
}

function UnHighlightImageDiv(pic) {
  pic.removeClass('active');
}

function IsOnCorrectImage(word, $scope) {
  imageId = "";
  $('.photoFrame').each(function () {
    if (IsWordRightEdgeAfterImageLeftEdge(word, $(this)) &&
					IsWordLeftEdgeBeforeImageRightEdge(word, $(this)) &&
					IsWordTopEdgeAboveImageBottomEdge(word, $(this)) &&
					IsWordBottomEdgeBelowImageTopEdge(word, $(this))) {
      imageId = $(this).children()[0].id;
    }
  });
  if ( imageId == word.children('span:first').html() ) {
    $scope.CorrectAnswer(imageId);
    return true;
  }
  else {
    WrongAnswer(imageId, word, $scope);
    return false;
  }
}

function DisplayFrameAsSolved (photoFrame) {
  photoFrame.addClass('solved');
}
function DisplayLabelAsSolved (imageId) {
  label_button = $("#label_" + imageId);
  label_button.draggable( 'destroy' );
  label_button.css("position", "absolute");
  topPlaceOfWord =  $("#" + imageId).parent().offset().top +
                    $("#" + imageId).parent().height() -
                    label_button.height();
  label_button.css("top", topPlaceOfWord);
  label_button.css("left", $("#" + imageId).parent().offset().left);
  $("#label_" + imageId).detach();
  $("#" + imageId).parent().append(label_button);
}

function WrongAnswer (imageId, word, $scope) {
  DisplayFrameAsWrong($("#" + imageId).parent());
  $scope.SetLifes( $scope.lifes - 1);
  if ($scope.lifes >= 0 ) {
    ShowLifes($scope);
  }
  else {
    $scope.LostGame();
  }
}
function DisplayFrameAsWrong (photoFrame) {
  photoFrame.addClass("wrong");
}

function ClearDisplayingAsWrongOrActive() {
  $(".photoFrame").each ( function () {
    if ($(this).hasClass('wrong')) {
      $(this).removeClass('wrong');
    }
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
    }
  });
}

function HowManySolved () {
  i = 0;
  $(".photoFrame").each (function () {
    if ($(this).hasClass('solved')) {
      i++;
    }
  });
  return i;
}
