angular.module('main')
.controller('WhatIsItCtrl', function (categories) {
  console.log("RootCtrl");
  ReadJSONPaths(categories);
});
