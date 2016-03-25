// this file takes the employee database and runs 
// a scheduled function nightly to update the 
// changes then exporting to a ./data/output.csv
var _        = require('underscore');
var fs       = require('fs');
var json2csv = require('json2csv');
var schedule = require('node-schedule');

var mongoose = require("mongoose");
var Employee = require('./employee.js');

// daily at midnight = '0 0 * * * *'
var csv_updater = schedule.scheduleJob('*/10 * * * * *', function(){

});

	var CSV = 'colour,email_address,full_name,id,job_title,mugshot_url_template,parent,phone_numbers,statistic_1,statistic_2,summary,web_url\n';

  // find all employees and create csv from them
	Employee.find({}, function (err, docs) {
	  if (err){
	    console.log(err);
	  } else {
	  	_.each(docs, function(val){

	  		CSV += "-"+",";
	  		CSV += val.contact.email +",";
	  		CSV += val.name.first + ' ' + val.name.last+",";
	  		CSV += val.dsw+",";
	  		CSV += val.position.title+",";

	  		var img = [val.imageBase64];
	  		img.push('"');
	  		img.unshift('"');
	  		console.log(img.join(""));
	  		CSV += img.join("") +",";
	  		CSV += val.manager.dsw+",";
	  		CSV += val.contact.phone+",";
	  		CSV += val.editedAt+",";
	  		CSV += val.createdAt+",";
	  		CSV += val.bio+",";
	  		CSV += "-"+"\n";

	  		//console.log(CSV);
	  	});
		}

	  fs.writeFile('./public/data/output.csv', CSV, function(err) {
	    if (err) throw err;
	    console.log('csv saved');
	  });
	
	});