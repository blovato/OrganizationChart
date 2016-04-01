var mongoose = require("mongoose");
var Employee = require('./employee.js');
var csv = require('./csv_update.js');
var OID = mongoose.Types.ObjectId;

var mohammed = new Employee({
  "_id": new OID,
  "dsw": 1,
  "name": {
    "first": "Mohammed",
    "last": "Nuru",
    "nickname": ""
  },
  "contact": {
    "email": "mohammed.nuru@sfdpw.org",
    "phone": "todo"
  },
  "position": {
    "title": "Director of Public Works",
    "classification": "TODO",
    "bureau": "TODO",
    "department": "DPW"
  },
  "bio": "TODO",
  "imageBase64": "https://msudenver.edu/media/sampleassets/profile-placeholder.png",
  "manager": {
    "dsw": null,
    "first": "",
    "last": "",
    "email": ""
  },
  "createdAt": new Date,
  "editedAt": new Date
}, {
  autoIndex: true
});

var cynthia = new Employee({
  "_id": new OID,
  "dsw": 2,
  "name": {
    "first": "Cynthia",
    "last": "Chono",
    "nickname": ""
  },
  "contact": {
    "email": "todo@sfdpw.org",
    "phone": "todo"
  },
  "position": {
    "title": "Manager",
    "classification": "todo",
    "bureau": "EMP",
    "department": "DPW"
  },
  "bio": "todo",
  "imageBase64": "https://msudenver.edu/media/sampleassets/profile-placeholder.png",
  "manager": {
    "dsw": 1,
    "first": "Mohammed",
    "last": "Nuru",
    "email": "mohammed.nuru@sfdpw.org"
  },
  "createdAt": new Date,
  "editedAt": new Date
}, {
  autoIndex: true
});

var rachel = new Employee({
  "_id": new OID,
  "dsw": 3,
  "name": {
    "first": "Rachel",
    "last": "Gordon",
    "nickname": ""
  },
  "contact": {
    "email": "todo@sfdpw.org",
    "phone": "todo"
  },
  "position": {
    "title": "Director",
    "classification": "todo",
    "bureau": "PC",
    "department": "DPW"
  },
  "bio": "todo",
  "imageBase64": "https://msudenver.edu/media/sampleassets/profile-placeholder.png",
  "manager": {
    "dsw": 1,
    "first": "Mohammed",
    "last": "Nuru",
    "email": "mohammed.nuru@sfdpw.org"
  },
  "createdAt": new Date,
  "editedAt": new Date
}, {
  autoIndex: true
});

var siobhan = new Employee({
  "_id": new OID,
  "dsw": 4,
  "name": {
    "first": "Siobhan",
    "last": "Kelly",
    "nickname": ""
  },
  "contact": {
    "email": "todo@sfdpw.org",
    "phone": "todo"
  },
  "position": {
    "title": "Manager",
    "classification": "todo",
    "bureau": "UPW",
    "department": "DPW"
  },
  "bio": "todo",
  "imageBase64": "https://msudenver.edu/media/sampleassets/profile-placeholder.png",
  "manager": {
    "dsw": 1,
    "first": "Mohammed",
    "last": "Nuru",
    "email": "mohammed.nuru@sfdpw.org"
  },
  "createdAt": new Date,
  "editedAt": new Date
}, {
  autoIndex: true
});

// remove all from db
// save model in db
/*
Employee.remove({}, function(d) {
  console.log("deleted all employees");
});

mohammed.save();
rachel.save();
cynthia.save();
siobhan.save();

csv.update();
*/