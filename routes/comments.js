const express = require('express'),
	router = express.Router({ mergeParams: true }),
	middleware = require('../middleware/'),
	Campground = require('../models/campground'),
	Comment = require('../models/comment');

//Comments New
router.get('/new', middleware.isLoggedIn, function(req, res) {
	//find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

//Comments Create
router.post('/', middleware.isLoggedIn, (req, res) => {
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash('error', 'Something went wrong');
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//connect comment to campground
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Congrats, you successfully added the comment!');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			req.flash('success', 'Oops, something went wrong!');
			res.redirect('back');
		} else {
			res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
		}
	});
});

//update route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			req.flash('error', 'Oops, something went wrong!');
			res.redirect('back');
		} else {
			req.flash('success', 'Congrats! You successfully edited your comment!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//delete comment route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			req.flash('success', 'Oops, something went wrong!');
			res.redirect('back');
		} else {
			req.flash('success', 'Comment successfully deleted!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;
