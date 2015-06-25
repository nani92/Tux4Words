angular.module('main')
.controller('OrderTheLettersCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  $('#imageContainer').prepend($scope.currentImage);
  DisplayLifes($scope);
  AddDraggable();
  AddDroppable();
  function AddDraggable () {
    $('.letter_button').each( function () {
      $(this).draggable({
        start: function () {},
        drag: function () {
          IsOnFrame($(this));
        },
        revert: function () {
          if (IsOnFrame($(this)) ) {
            DroppedOnFrame($(this));
            return false;
          }
          return true;
        },
        stop: function () {
          //ClearDisplayingAsWrongOrActive();
        }
      });
    });
  }
  function AddDroppable () {
    $('.letter_frame').each(function () {
      $(this).droppable();
    });
  }
});

function DisplayLifes ($scope) {
  for (i = 3; i > 0; i--) {
    if ($scope.lifes < i ) {
      $('#' + i.toString() + 'life').attr('class', 'dead');
    }
  }
}

function IsOnFrame(letter) {
  droppedOnFrame = false;
  $('.letter_frame').each(function () {
    if (IsletterMiddleAfterFrameLeftEdge(letter, $(this)) &&
					IsletterLeftEdgeBeforeFrameRightEdge(letter, $(this)) &&
					IsletterTopEdgeAboveFrameBottomEdge(letter, $(this)) &&
					IsletterBottomEdgeBelowFrameTopEdge(letter, $(this))) {
      droppedOnFrame = true;
      HighlightImageDiv($(this));
    }
    else {
      UnHighlightImageDiv($(this));
    }
  });
  return droppedOnFrame;
}

function IsletterMiddleAfterFrameLeftEdge(letter, pic) {
  return (letter.offset().left + letter.width() * 1 / 2 ) > pic.offset().left;
}

function IsletterLeftEdgeBeforeFrameRightEdge(letter, pic) {
  return (letter.offset().left + letter.width() * 1 / 2 ) < (pic.offset().left + pic.width());
}

function IsletterTopEdgeAboveFrameBottomEdge(letter, pic) {
  return (letter.offset().top ) < (pic.offset().top + (pic.height()));
}

function IsletterBottomEdgeBelowFrameTopEdge(letter, pic) {
  return (letter.offset().top + letter.height()) > pic.offset().top;
}

function HighlightLetterFrame (frame) {
  frame.addClass('active');
}

function DroppedOnFrame (letter) {
  var frame;
  $('.letter_frame').each(function () {
    if ($(this).hasClass('active')) {
      frame = $(this); 
      return;
    } 
  });
  frame.removeClass('active');
  frame.addClass('solved');
  letter.detach();
  frame.children('span:first').html(letter.children('span:first').html());
}
