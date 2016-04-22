var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require("mongoose");
var _ = require('underscore');

// connect to local db instance
mongoose.connect('mongodb://devwebtest/employeesDPW');

// set global root variable
global.__root = __dirname + '/';

// models
var Employee = require('./models/employee.js');
var employeeSeed = require("./models/seed.js");
// routes
var routes = require('./routes');

//middleware
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

/****  API  ****/
// api route to get users based on their dsw number
// /_api/employees?dsw=[XXXXXX]&first=[FIRSTNAME]&last=[LASTNAME]
app.get('/api/employee', routes.api.getEmployee);
// api route to add a new user
app.post('/api/employee/new', routes.api.postNewEmployee);
// api route to update existing user
app.post('/api/employee/:dsw/update', routes.api.postUpdateEmployee);

/**** ROUTES ****/
// view route to org chart viewer
app.get('/orgchart', routes.views.orgchart);

// front end routing handled by Angular
app.get('/', routes.views.layout);
app.get('/partials/:name', routes.views.partials);
app.get('*', routes.views.layout);

// start server
var port = 3000;
app.listen(port, function() {
	console.log('Server is running at http://localhost:' + port);
});