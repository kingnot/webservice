/* Define data model for User */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String, required: true, trim: true}
},{
	timestamps: true
});

module.exports = mongoose.model('User', UserSchema);