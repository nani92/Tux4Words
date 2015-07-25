angular.module('main')
.controller('ConnectCtrl', function (categories, $scope, $state) {
  console.log("CONNECT CTRL");
  $scope.title = $state.current.displayName;
  AppendImages($scope);
  ShowLifes($scope);
  $scope.$on('onRepeatLast', function (scope, element, attrs) {
   console.log("ON LAST");
    AddDraggableForLabels();
    AddDroppableForFrames();
  });
  $scope.CorrectAnswer = function CorrectAnswer (imageId) {
    DisplayFrameAsSolved($('#' + imageId).parent());
    DisplayLabelAsSolved(imageId);
    $scope.$apply ( function () {
      $scope.SetPoints($scope.points + 10);
      categories.increaseStatusOfWord(imageId);
    });
    if (HowManySolved() == 3) {
      $scope.Connect_Next();
    }
  }
  $scope.LostGame = function LostGame () {
    $state.go('root.Connect');
  }
  /*********************************************************/
  /*                 PREPARING EXERCISE                    */
  /*********************************************************/
  function AppendImages() {
    for ( i = 1 ; i <= 3 ; i++) {
      $('#PhotoFrame' + i.toString()).append($scope.connectImages[i - 1]);
    }
  }
  function AddDraggableForLabels () {
    $('.label_button').each( function () {
      $(this).draggable({
        start: function () {},
        drag: function () {
          IsOnImage($(this));
        },
        revert: function () {
          console.log("REVERT?");
          if (IsOnImage($(this)) && IsOnCorrectImage($(this)) ) {
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
  function AddDroppableForFrames () {
    $('.photoFrame').each(function () {
      $(this).droppable();
    });
  }
  /*********************************************************/
  /*            COLLIDING  WORD WITH IMG                   */
  /*********************************************************/
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
  function IsOnCorrectImage(word) {
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
      WrongAnswer(imageId, word);
      return false;
    }
  }
  /*********************************************************/
  /*                          DISPLAYING                   */
  /*********************************************************/
  function HighlightImageDiv(pic) {
    pic.addClass('active');
  }
  function UnHighlightImageDiv(pic) {
    pic.removeClass('active');
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
  /*********************************************************/
  /*             HELPERS                                   */
  /*********************************************************/
  function HowManySolved () {
    i = 0;
    $(".photoFrame").each (function () {
      if ($(this).hasClass('solved')) {
        i++;
      }
    });
    return i;
  }
  function WrongAnswer (imageId, word) {
    DisplayFrameAsWrong($("#" + imageId).parent());
    categories.decreaseStatusOfWord(imageId);
    $scope.AddToCurrentTasks(GetNumberOfParentFrame(imageId));
    $scope.SetLifes( $scope.lifes - 1);
    if ($scope.lifes >= 0 ) {
      ShowLifes($scope);
    }
    else {
      $scope.LostGame();
    }
  }
  function GetNumberOfParentFrame(imageId) {
    frame = $("#" + imageId).parent();
    id = frame.attr('id');
    console.log(id);
    number = parseInt(id.slice(id.length - 1));
    console.log(number);
    return number - 1;
  }
});
