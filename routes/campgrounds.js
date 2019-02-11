const   express     = require("express"),
        router      = express.Router(),
        middleware  = require("../middleware/"),
        Comment     = require("../models/comment"),
        Campground  = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

//create new campground route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//save new campground route
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price= req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author, price: price};
    //create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");  
        }
    });
});

//showpage route
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
             //render show template with that campground
             res.render("campgrounds/show", {campground: foundCampground});       
        }
    });
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
           req.flash("error", "Campground not found");
           res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});     
        }
    });
});

// update campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampgroud) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res, next) => {
    Campground.findById(req.params.id, function(err, campground) {
        Comment.remove({
            "_id": {
                $in: campground.comments
                }
            }, function(err) {
                if(err) return next(err);
                campground.remove();
                res.redirect("/campgrounds");
        }); 
    });
});


module.exports = router;
