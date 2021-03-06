/*
 * Author: Fei Wang
 * Date: Oct 27, 2016
 * Define data model for User by using mongoose.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname: {type: String, required: true, trim: true},
    lastname: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    city: {type: String, required: true, trim: true}
},{
	timestamps: true	//time created and updated will be saved automatically by mongoose
});

module.exports = mongoose.model('User', UserSchema);