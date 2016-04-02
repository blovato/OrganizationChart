var _ = require('underscore');
var mongoose = require("mongoose");
var Employee = require(__root + '/models/employee.js');
var csv = require(__root + '/models/csv_update.js'); // csv update scheduler

module.exports = {
  api: {
    getEmployee: function(req, res) {
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
    },
    postNewEmployee: function(req, res) {
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
      }
      setTimeout(csv.update, 1000);
      res.send("Employee Saved");
    },
    postUpdateEmployee: function(req, res) {
      var r = req.body;
      r.editedAt = new Date;
      // find Manager's DSW and email if not provided
      Employee.findOneAndUpdate({
        'dsw': req.params.dsw
      }, {
        $set: r
      }, function(err, doc) {
        if (err) res.send(err);
        res.send("Employee Updated");
        csv.update();
      });
    }
  },
  views: {
    orgchart: function(req, res) {
      res.sendfile(__root + '/public/orgchart/index.html');
    },
    layout: function(req, res) {
      res.render('layout');
    },
    partials: function(req, res) {
      var name = req.params.name;
      res.render('partials/' + name);
    }
  }
};
