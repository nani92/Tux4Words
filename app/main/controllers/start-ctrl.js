'use strict';
angular.module('main')
.controller('StartCtrl', function (Start, Config, $scope, $state, sharedData) {

  // bind data from service
  this.someData = Start.someData;
  this.ENV = Config.ENV;
  this.BUILD = Config.BUILD;

  console.log('Hello from your Controller: StartCtrl in module main:. This is your controller:', this);
  // TODO: do your controller thing
  //ReadJsonFiles();
  $scope.basicOptions = ['Play', 'Categories'];
  $scope.exerciseOptions = ['What is it?', 'Connect', 'Order the letters', 'Type in'];
  $scope.MoveTo = function (option) {
    console.log('Move to ' + option);
    $state.go(option);
  };
});

function ReadJsonFiles() {
  var fs = require ('fs');
  var dir = 'app/main/assets/json';
  var data = {};
  fs.readdir (dir, function (err, files) {
    if (err) { throw err };
    console.log ("dir exists");
    var c = 0;
    files.forEach (function (file) {
      c++;
      fs.readFile (dir + file, 'utf-8', function (err, html) {
        if (err) { throw err };
        data[file] = html;
        c--;
        if (0 === c) {
          console.log(data);  //socket.emit('init', {data: data});
        }
      });
    });
  });
}
