// public/core.js
var orgChart = angular.module('orgChart', []);

function ChartCtrl($scope, $http) {
  $scope.formData = {};

  // when landing on the page, get all todos and show them
  $http.get('/_api/employees')
    .success(function(data) {
      $scope.employees = data;
      console.log(data);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // when submitting the add form, send the text to the node API
  $scope.createTodo = function() {

  };

  // delete a todo after checking it
  $scope.deleteTodo = function(id) {

  };

}
