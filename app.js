var express = require('express');
var app = express();
var mongoose = require("mongoose");

var Employee      = require('./models/employee.js'),
employeeFormatted = require("./models/employeeFormatted.js");

app.get('/', function(req, res) {
	Employee.find({}, function (err, docs) {
	  res.json(docs);
	});
});

app.listen(3000);