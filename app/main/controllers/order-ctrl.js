angular.module('main')
.controller('OrderTheLettersCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  $('#imageContainer').prepend($scope.currentImage);
  ShowLifes($scope);
  $scope.$on('onRepeatLast', function (scope, element, attrs) {
    AddDraggableForLetterButtons();
    AddDroppableForLetterFrames();
    if ($('.letter_frame').length > 4) {
      $('.letter_frame').each(function (key, value) {
        $(value).css("width", "12vw");
      });
    }
  });
  /*********************************************************/
  /*                 PREPARING EXERCISE                    */
  /*********************************************************/
  function AddDraggableForLetterButtons () {
    $('.letter_button').each( function () {
      AddDraggable($(this));
    });
  }
  function AddDraggable (letter) {
    letter.draggable({
      start: function () {},
      drag: function () {
        IsOnFrame(letter);
      },
      revert: function () {
        if (IsOnFrame(letter) ) {
          DroppedOnFrame(letter);
          if (IsSolved()) {
            if (IsAnswerCorrect()) {
              categories.increaseStatusOfWord($scope.currentImage.attr('id'));
              $scope.SetPoints($scope.points + 10);
              $scope.Order_Next();
            }
            else {
              categories.decreaseStatusOfWord($scope.currentImage.attr('id'));
              $scope.AddToCurrentTasks();
              $scope.SetLifes( $scope.lifes - 1);
              $scope.ShowProperBoard();
            }
            
          }
          return false;
        }
        return true;
      },
      stop: function () {}
      });
  }
  function AddDroppableForLetterFrames () {
    $('.letter_frame').each(function () {
      $(this).droppable();
    });
  }
  $scope.RemoveAnswer = function (event) {
    frameDiv = $(event.currentTarget);
    if (frameDiv.hasClass('solved')) {
      AddLetter(frameDiv.children("span:first").html());
      frameDiv.children("span:first").html("0");
      frameDiv.removeClass('solved');
      frameDiv.addClass('ui-droppable');
    }
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
        if($(this).hasClass('ui-droppable')) {
          HighlightLetterFrame($(this));
        }
        else {
          droppedOnFrame = false;
        }
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
    frame.removeClass('ui-droppable');
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
  
  function AddLetter (letter) {
    var divCont = $("#order_letters");
    letterDiv = CreateLetterDiv(letter);
    AddDraggable(letterDiv);
    divCont.append(letterDiv);
    
  }
  
  function CreateLetterDiv (letter) {
    return $('<div class="letter_button"><span>' 
             + letter + '</span></div>');
  }
});
