var app = angular.module('newEmployee', ['imageupload']);

app.controller('newEmployeeCtrl', function($scope, $http) {

/* stream webcam TODO
  var video = document.querySelector("#videoElement");

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({
      video: true
    }, function handleVideo(stream) {
      video.src = window.URL.createObjectURL(stream);
    }, function videoError(err) {
      console.log(err);
    });
  }
*/

  // your info testing
  $scope.dsw = 4;
  $scope.first = 'testFirst';
  $scope.last = 'testLast';
  $scope.phone = 83212344;
  $scope.email = "test";
  $scope.email = $scope.email + "@sfdpw.org";
  $scope.title = 'testTitle';
  $scope.classification = '1234';
  $scope.bureau = "IT";
  $scope.department = "DPW";

  // you managers info testing
  //$scope.manager_dsw = '';
  $scope.manager_first = 'John';
  $scope.manager_last = 'Stamos';
  //$scope.manager_email = '';

  this.submitNewEmployee = function(image) {
    // check if form data is valid
    if ($scope.newEmployeeForm.$valid) {
      // create post data from form
      var data = {
        "dsw": $scope.dsw,
        "name": {
          "first": $scope.first,
          "last": $scope.last,
          "nickname": $scope.nickname
        },
        "contact": {
          "email": $scope.email,
          "phone": $scope.phone
        },
        "position": {
          "title": $scope.title,
          "classification": $scope.classification,
          "bureau": $scope.bureau,
          "department": $scope.department
        },
        "bio": $scope.bio,
        "imageBase64": image.resized.dataURL,
        "manager": {
          "dsw": $scope.manager_dsw,
          "first": $scope.manager_first,
          "last": $scope.manager_last,
          "email": $scope.manager_email
        }
      };

      // send post request to api
      $http.post('/api/employee/new', data)
        .then(function(res) {
          console.log(res);
          // if successful route back to home
          setTimeout(function(){
            window.location.href = '/';
          }, 1300);
        }, function(err) {
          console.log(err);
        });
    }
  };
});