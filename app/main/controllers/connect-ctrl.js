angular.module('main')
.directive('onLastRepeat', function() {
  return function(scope, element, attrs) {
    if (scope.$last) setTimeout(function(){
      scope.$emit('onRepeatLast', element, attrs);
    }, 1);
  };
})
.controller('ConnectCtrl', function (categories, $scope, $state) {
  $scope.title = $state.current.displayName;
  AppendImages($scope);
  ShowLifes($scope);
  $scope.$on('onRepeatLast', function(scope, element, attrs){
    $('.label_button').each(function () {
      console.log("d");
      console.log(this);
      $(this).draggable({
        start: function () {},
        drag: function () {
          console.log("drag");
        },
        revert: function () {
          console.log("rev");
        },
        stop: function () {}
      });
    });
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
