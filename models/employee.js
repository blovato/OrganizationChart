var _        = require("underscore");
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//***** SCHEMAS
var basicNameSchema = new Schema({
  "dsw": Number,
	"first": String,
	"last": String,
  "_id": ObjectId
});

var employeeSchema = new Schema({
	"_id": ObjectId,
	"dsw": Number,
  "name": {
    "first": String,
    "last": String,
    "nickname": String
  },
  "contact": {
  	"email": String,
  	"phone": String
  },
  "position": {
  	"title": String,
  	"classification": String,
  	"bureau": String,
  	"department": String
  },
  "bio": String,
  "imageBase64": String,
  "manager": basicNameSchema,
  "children": [basicNameSchema],
  "createdAt": Date,
  "editedAt": Date
});

//***** SCHEMA METHODS
// returns full name
employeeSchema.methods.fullName = function fullName(){ 
  return this.name.first + " " + this.name.last 
};

// returns non private information. Hides DSW IDs and 
employeeSchema.methods.child = function child(){
  if(this.children.length > 0){
    return this.children;
  } else {
    return null
  }
};

// returns non private information. Hides DSW IDs and 
employeeSchema.methods.parent = function parent(){
  return this.manager;
};


/***** MIDDLEWARE
employeeSchema.pre('save', function (next,done) {
  console.log(this._id);
  // something goes wrong
  next(new Error('something went wrong'));
});
*/

module.exports = mongoose.model("Employee", employeeSchema);