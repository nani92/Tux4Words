angular.module('main')
.controller('OrderTheLettersCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  $('#imageContainer').prepend($scope.currentImage);
  ShowLifes($scope);
  $scope.$on('onRepeatLast', function (scope, element, attrs) {
    AddDraggableForLetterButton();
    AddDroppableForLetterFrame();
  });
  /*********************************************************/
  /*                 PREPARING EXERCISE                    */
  /*********************************************************/
  function AddDraggableForLetterButton () {
    $('.letter_button').each( function () {
      $(this).draggable({
        start: function () {},
        drag: function () {
          IsOnFrame($(this));
        },
        revert: function () {
          if (IsOnFrame($(this)) ) {
            DroppedOnFrame($(this));
            if (IsSolved()) {
              if (IsAnswerCorrect()) {
                categories.increaseStatusOfWord($scope.currentImage.attr('id'));
                $scope.SetPoints($scope.points + 10);
              }
              else {
                categories.decreaseStatusOfWord($scope.currentImage.attr('id'));
                $scope.AddToCurrentTasks();
                $scope.SetLifes( $scope.lifes - 1);
              }
              $scope.Order_Next();
            }
            return false;
          }
          return true;
        },
        stop: function () {}
      });
    });
  }
  function AddDroppableForLetterFrame () {
    $('.letter_frame').each(function () {
      $(this).droppable();
    });
  }
  /*********************************************************/
  /*                 COLLIDING                             */
  /*********************************************************/
  function IsOnFrame(letter) {
    droppedOnFrame = false;
    $('.letter_frame').each(function () {
      if (IsletterMiddleAfterFrameLeftEdge(letter, $(this)) &&
                      IsletterLeftEdgeBeforeFrameRightEdge(letter, $(this)) &&
                      IsletterTopEdgeAboveFrameBottomEdge(letter, $(this)) &&
                      IsletterBottomEdgeBelowFrameTopEdge(letter, $(this))) {
        droppedOnFrame = true;
        HighlightLetterFrame($(this));
      }
      else {
        UnHighlightLetterFrame($(this));
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
  /*********************************************************/
  /*                 DISPLAYING                            */
  /*********************************************************/
  function HighlightLetterFrame (frame) {
    frame.addClass('active');
  }
  function UnHighlightLetterFrame (frame) {
    frame.removeClass('active');
  }
  /*********************************************************/
  /*                 HELPERS                               */
  /*********************************************************/
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

  function IsSolved() {
    solved = true;
    $('.letter_frame').each( function () {
      if (!$(this).hasClass('solved')) {
        solved = false;
      }
    });
    return solved;
  }

  function IsAnswerCorrect() {
    answer = "";
    $('.letter_frame').each( function () {
      answer += $(this).children('span:first').html();
    });
    if (answer === ($('#imageContainer').children('img')[0]).id) {
      return true;
    }
    else {
      return false;
    }
  }
});
