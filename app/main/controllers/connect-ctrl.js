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
    AddDraggable();
    AddDroppable();
  });
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
function AddDraggable () {
  $('.label_button').each( function () {
    $(this).draggable({
      start: function () {},
      drag: function () {
        IsOnImage($(this));
      },
      revert: function () {
        console.log("rev");
      },
      stop: function () {}
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
    if (IsRightEdgeOnImage(word, $(this)) &&
					IsLeftEdgeOnImage(word, $(this)) &&
					IsTopEdgeOnImage(word, $(this)) &&
					IsBottomEdgeOnImage(word, $(this))) {
      droppedOnImage = true;
      HighlightImageDiv($(this));
    }
    else {
      UnHighlightImageDiv($(this));
    }
  });
  return droppedOnImage;
}

function IsRightEdgeOnImage(word, pic) {
  return (word.offset().left + word.width()) > pic.offset().left;
}

function IsLeftEdgeOnImage(word, pic) {
  return word.offset().left < (pic.offset().left + pic.width());
}

function IsTopEdgeOnImage(word, pic) {
  return word.offset().top < (pic.offset().top + pic.height());
}

function IsBottomEdgeOnImage(word, pic) {
  return (word.offset().top + word.height()) > pic.offset().top;
}

function HighlightImageDiv(pic) {
  pic.addClass('active');
  //pic.attr('class', 'active');
}

function UnHighlightImageDiv(pic) {
  pic.removeClass('active');
}
