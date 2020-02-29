require('dotenv').config();

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	User = require('./models/user'),
	methodOverride = require('method-override'),
	flash = require('connect-flash');

//requiring routes
const commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

const url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp';
mongoose.connect(url, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

//passport configuration
app.use(
	require('express-session')({
		secret: "I love Rachmaninoff's Adagio from his 2nd sonate!",
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes); //add prefix to route
app.use('/campgrounds/:id/comments', commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.IP, function() {
	console.log(`YelpCamp Server has started on port ${PORT}!`);
});
