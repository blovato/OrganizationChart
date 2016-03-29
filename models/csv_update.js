// this file takes the employee database and runs 
// a scheduled function nightly to update the 
// changes then exporting to a ./data/output.csv
var _        = require('underscore');
var fs       = require('fs');
var schedule = require('node-schedule');
var mongoose = require("mongoose");
var Employee = require('./employee.js');

var updateCSV = function(){

	var CSV = 'colour,email_address,full_name,id,job_title,mugshot_url_template,parent,phone_numbers,statistic_1,statistic_2,summary,web_url\n';

    // find all employees and create csv from them
	Employee.find({}, function (err, docs) {
	  if (err){
	    console.log(err);
	  } else {
	  	_.each(docs, function(val){
	  		CSV += "-"+","; // colour
	  		CSV += val.contact.email +","; // email
	  		CSV += val.name.first + ' ' + val.name.last+","; // full name
	  		CSV += val.dsw+","; // dsw number
	  		CSV += val.position.title+","; // position title

	  		// comma esape base64
	  		var img = [val.imageBase64];
	  		img.push('"');
	  		img.unshift('"');
	  		CSV += img.join("") +","; // base64 encoded image

	  		// test if CEO
	  		if(val.manager.dsw === null){
	  			CSV += ""+","; // ceo's manager is null
	  		} else {
	  			CSV += val.manager.dsw+","; // parent/manager's dsw number
	  		}

	  		CSV += val.contact.phone+","; // phone number
	  		CSV += val.editedAt+","; //stat 1
	  		CSV += val.createdAt+","; // stat 2
	  		CSV += val.bio+","; // about text
	  		CSV += "-"+"\n"; // web url
	  	});
		}

		// export to data dir
	  fs.writeFile('./public/data/output.csv', CSV, function(err) {
	    if (err) throw err;
	    console.log('./public/data/output.csv saved');
	  });
	});
};

// daily at midnight cron = '0 0 * * * *'
var csv_updater = schedule.scheduleJob('* * * * *', updateCSV);

module.exports = {update: updateCSV};