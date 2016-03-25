var express = require('express');
var app = express();
var mongoose = require("mongoose");
mongoose.connect('mongodb://devwebtest/employeesDPW');

// models
var Employee = require('./models/employee.js'),
csv_update   = require('./models/csv_update.js'), // csv update scheduler
employeeSeed = require("./models/seed.js");

app.use(express.static(__dirname + '/public'));

app.get('/_api/employees', function(req, res) {
	Employee.find({}, function (err, docs) {
	  if (err)
      res.send(err);
    res.json(docs);
	});
});

app.get('/', function(req, res){
	res.sendfile('./public/index.html');
});

app.listen(3001);