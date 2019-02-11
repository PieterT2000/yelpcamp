const   express = require("express"),
        router  = express.Router(),
        passport= require("passport"),
        User    = require("../models/user");

//root route        
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handling sign up logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Succesfully signed up! Nice to meet you " + user.username);
            res.redirect("/campgrounds");
        });
    });
});


//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res) => {
});

//logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You logged out successfully!");
    res.redirect("/campgrounds");
});

module.exports = router;