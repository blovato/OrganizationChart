var express = require('express');
var app = express();
var mongoose = require("mongoose");
var _ = require('underscore');
mongoose.connect('mongodb://devwebtest/employeesDPW');

// models
var Employee     = require('./models/employee.js');
var csv_update   = require('./models/csv_update.js'); // csv update scheduler
var employeeSeed = require("./models/seed.js");

app.use(express.static(__dirname + '/public'));

// api route to get users based on their dsw number
// accepts arguments dsw & first & last
// /_api/employees?dsw=[XXXXXX]&first=[FIRSTNAME]&last=[LASTNAME]
app.get('/_api/employees', function(req, res) {
  console.log(req.query);
  if (_.isEmpty(req.query)) {
    Employee.find({}, function(err, docs) {
      if (err) res.send(err);
      else res.json(docs);
    });
  } else if (req.query.hasOwnProperty('dsw')) {
    Employee.findOne({
      dsw: req.query.dsw
    }, function(err, docs) {
      console.log();
      if (err) res.send(err);
      if (docs !== null) {
        res.json(docs);
      } else {
        res.send("unable to locate any employees with that DSW number");
      }
    });
  } else if (req.query.hasOwnProperty('first') && req.query.hasOwnProperty('last')) {
    Employee.findOne({
      'name.first': req.query.first,
      'name.last': req.query.last
    }, function(err, docs) {
      if (err) res.send(err);
      if (docs !== null) {
        res.json(docs);
      } else {
        res.send("Employee " + req.query.first + " " + req.query.last + " was not found");
      }
    });
  } else {
    res.send("Please supply a dsw number or both the first and last name as parameters");
  }

});

// api route to add a new user
app.post('/_api/employees/new', function(req, res) {
  Employee.find({}, function(err, docs) {
    if (err)
      res.send(err);
    res.json(docs);
  });
});
// api route to update existing user
app.post('/_api/employees/update', function(req, res) {
  Employee.find({}, function(err, docs) {
    if (err)
      res.send(err);
    res.json(docs);
  });
});


// route to org chart viewer
app.get('/', function(req, res) {
  res.sendfile('./public/index.html');
});

// route to new employee
app.get('/new', function(req, res) {
  res.sendfile('./public/new.html');
});

// route to update employee
app.get('/update/:dsw', function(req, res) {
  console.log(req.params.dsw);
  res.sendfile('./public/new.html');
});

app.listen(3000);