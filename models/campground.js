const mongoose = require("mongoose");
const Comment  = require("./comment");
//schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


//use schema in model
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;