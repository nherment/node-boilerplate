'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('HomeCtrl', ['$scope', 'backend',
  function($scope, backend) {
//    backend.send('hello')
  }]);

phonecatControllers.controller('SignInCtrl', ['$scope', 'backend',
  function($scope, backend) {
//    backend.send('hello')
  }]);

phonecatControllers.controller('SignUpCtrl', ['$scope', 'backend',
  function($scope, backend) {
//    backend.send('hello')
  }]);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone', 'backend',
  function($scope, Phone, backend) {
    backend.send('hello')
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
