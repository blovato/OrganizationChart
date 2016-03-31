var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require("mongoose");
var _ = require('underscore');
mongoose.connect('mongodb://devwebtest/employeesDPW');

// models
var Employee = require('./models/employee.js');
var employeeSeed = require("./models/seed.js");
var csv = require('./models/csv_update.js'); // csv update scheduler

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

/**** API ****/
// api route to get users based on their dsw number
// accepts arguments dsw & first & last
// /_api/employees?dsw=[XXXXXX]&first=[FIRSTNAME]&last=[LASTNAME]
app.get('/api/employee', function(req, res) {
  if (_.isEmpty(req.query)) {
    Employee.find({}, function(err, docs) {
      if (err) res.send(err);
      else res.json(docs);
    });
  } else if (req.query.hasOwnProperty('dsw')) {
    Employee.findOne({
      dsw: req.query.dsw
    }, function(err, docs) {
      if (err) res.send(err);
      if (docs !== null) {
        res.json(docs);
      } else {
        res.send({
          error: "unable to locate any employees with that DSW number"
        });
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
app.post('/api/employee/new', function(req, res) {
  var r = req.body;
  var newEmployee;
  r._id = new mongoose.Types.ObjectId;
  r.createdAt = new Date;
  r.editedAt = new Date;

  // find Manager's DSW and email if not provided
  if (!r.manager.hasOwnProperty('dsw') || !r.manager.hasOwnProperty('email')) {
    Employee.find({
      'name.first': r.manager.first,
      'name.last': r.manager.last
    }, 'dsw contact', function(err, docs) {
      if (err) res.send(err);
      if (docs.length === 1) {
        r.manager.dsw = docs[0].dsw;
        r.manager.email = docs[0].contact.email;
        // save to db
        newEmployee = new Employee(r, {
          autoIndex: true
        });
        newEmployee.save();
        csv.update();
      } else if (docs.length > 1) {
        res.send({
          error: "Too many records returned, please enter Manager's email or dsw and retry"
        });
      } else {
        res.send({
          error: "Employee " + r.manager.first + " " + r.manager.last + " was not found"
        });
      }
    });
  } else {
    // save to db
    newEmployee = new Employee(r, {
      autoIndex: true
    });
    newEmployee.save();
    csv.update();
  }

  
  res.send("Employee Saved");
});

// api route to update existing user
app.post('/api/employee/:dsw/update', function(req, res) {
  var r = req.body;
  r.editedAt = new Date;
  // find Manager's DSW and email if not provided
  Employee.findOneAndUpdate({
    'dsw': req.params.dsw
  }, {$set: r }, function(err, doc) {
    if (err) res.send(err);
    res.send("Employee Updated");
    csv.update();
  });
});

/**** ROUTES ****/
// view route to org chart viewer
app.get('/orgchart', function(req, res) {
  res.sendfile(__dirname + '/public/orgchart/orgchart.html');
});

// front end routing handled by Angular
app.get('/', function(req, res) {
  res.render('layout');
});

app.get('/partials/:name', function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

app.get('*', function(req, res) {
  res.render('layout');
});

app.listen(3001);
