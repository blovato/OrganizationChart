var employeeApp = angular.module('employeeApp', ['imageupload', 'ngRoute'])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
      $routeProvider
        .when("/employee/", {
          templateUrl: "partials/list.jade",
          controller: "employeeListCtrl"
        })
        .when("/employee/new", {
          templateUrl: "partials/form.jade",
          controller: "employeeNewCtrl"
        })
        .when("/employee/:dsw/edit", {
          templateUrl: "partials/form.jade",
          controller: "employeeUpdateCtrl"
        })
        .otherwise({
          redirectTo: "/orgchart"
        });
    }
  ]);

employeeApp.controller('employeeListCtrl', function($scope, $http) {
  animation.pageLoad();

  $scope.pageExit = animation.pageExit;

  $http.get('/api/employee')
    .then(function(res) {
      // add variables to each element
      // to handle ui state
      $scope.employees = _.map(res.data, function(val) {
        val.active = false;
        val.name = val.name.first + ' ' + val.name.last;
        delete val.manager;
        return val;
      });

    }, error);

  $scope.hoverIn = function() {
    this.hoverEdit = true;
  };

  $scope.hoverOut = function() {
    this.hoverEdit = false;
  };

  $scope.toggle = function() {
    this.active = !this.active;
  };

  $scope.isRecent = function(time) {
    var now = new Date();
    var editedAt = new Date(time);
    if (now.getTime() - editedAt.getTime() < 9000000) {
      return true;
    } else {
      return false;
    }
  }
});

employeeApp.controller('employeeNewCtrl', function($scope, $http) {
  animation.pageLoad();

  // set scope
  $scope.form_title = "New Employee Form";
  $scope.imageIn = {};
  $scope.imageIn.url = "https://msudenver.edu/media/sampleassets/profile-placeholder.png"
  $scope.email = '';
  $scope.email = $scope.email + "@sfdpw.org";
  $('label[for="email"]').addClass('active');
  $scope.department = "DPW";


  $scope.submitEmployeeForm = function(image) {
    // check image

    var imageOut;
    if (image.hasOwnProperty('resized')) {
      imageOut = image.resized.dataURL;
    } else {
      imageOut = $scope.imageIn.url
    }
    // check if form data is valid
    if ($scope.employeeForm.$valid) {
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
        "imageBase64": imageOut,
        "manager": {
          "dsw": $scope.manager_dsw,
          "first": $scope.manager_first,
          "last": $scope.manager_last,
          "email": $scope.manager_email
        }
      };

      // send post request to api
      $http.post('/api/employee/new', data)
        .then(success, error);
    }
  };
});

employeeApp.controller('employeeUpdateCtrl', function($scope, $http, $routeParams) {
  // make image input not required
  $('input[type=file]').attr('required', false);
  animation.pageLoad();
  // set title if http call lags
  $scope.form_title = 'Update Employee';
  // send post request to api
  $http.get('/api/employee/?dsw=' + $routeParams.dsw)
    .then(function(res) {
      var r = res.data;
      // set existing data
      $scope.form_title = 'Update ' + r.name.first + ' ' + r.name.last;
      $scope.dsw = r.dsw;
      $scope.bio = r.bio;
      $scope.imageIn = {};
      $scope.imageIn.url = r.imageBase64;
      $scope.first = r.name.first;
      $scope.last = r.name.last;
      $scope.nickname = r.name.nickname;

      $scope.phone = r.contact.phone;
      $scope.email = r.contact.email;

      $scope.title = r.position.title;
      $scope.classification = r.position.classification;
      $scope.bureau = r.position.bureau;
      $scope.department = r.position.department;

      $scope.manager_dsw = r.manager.dsw;
      $scope.manager_first = r.manager.first;
      $scope.manager_last = r.manager.last;
      $scope.manager_email = r.manager.email;
      // set input labels to active to make readable
      $('label').addClass('active');

    }, error);

  $scope.submitEmployeeForm = function(image) {
    // check image
    var imageOut;
    if (image.hasOwnProperty('resized')) {
      imageOut = image.resized.dataURL;
    } else {
      imageOut = image.url
    }

    // check if form data is valid
    if ($scope.employeeForm.$valid) {
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
        "imageBase64": imageOut,
        "manager": {
          "dsw": $scope.manager_dsw,
          "first": $scope.manager_first,
          "last": $scope.manager_last,
          "email": $scope.manager_email
        }
      };
      // send post request to api
      $http.post('/api/employee/' + $routeParams.dsw + '/update', data)
        .then(success, error);
    }
  };
});

var animation = {
  pageLoad: function() {
    window.scrollTo(0, 0);
    $('#search').focus();
    $('.card, ul.collection').animate({
      opacity: 1,
      top: 0
    }, 1500, 'easeOutQuart');
    setTimeout(function() {
      $('h4.center-align, #search-bar, #back-btn').animate({
        opacity: 1
      }, 600, 'swing');
    }, 600);
  },
  pageExit: function(url) {
    $('.card, ul.collection').animate({
      opacity: 0,
      top: -500
    }, 1000, 'easeOutQuart', function() {
      //TODO finish search bar opac = 0
      if (Number.isInteger(url)) {
        location = '/employee/'+url+'/edit';
      } else {
        location = url;
      }
    });
  }
};

var success = function(res) {
  animation.pageExit('/employee');
  console.log(res);
}
var error = function(err) {
  console.log(err);
}

// TODO
var webcam = function() {
  // stream webcam TODO
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
};
