const mongoose = require('mongoose');
const Comment = require('./comment');
//schema setup
const campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

//use schema in model
const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
