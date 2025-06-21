const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");   //since hm app.js se 1 directory under hai .. use krna hoga
const { isLoggedIn } = require("../middleware.js");
const { isOwner, validateListing } = require("../middleware");
const listingController = require('../controllers/listing.js');


const multer = require('multer');
//  const upload =  multer({dest : 'upoads/'})
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage }); //now multer by default cloudinary ki storage me file upload krega


//combining index route and create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing,
        wrapAsync(listingController.createListing));



//NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);


//combining show route,edit route,delete and update route 
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));





//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.renderEditForm));



module.exports = router;



// //CREATE ROUTE
// app.post("/listings", wrapAsync(async (req, res, next) => {
//     // METHOD 1   let{title,description,image,price,location,country} = req.body; //or METHOD 2 new.ejs  me name ko key value pair me store krwa do

//     if (!req.body.listing) {
//         throw new ExpressError(400, "Send valid data for listing"); //agar lisitng me data nhi bheja toh
//     }
//        //METHOD 2  new.ejs  me name ko key value pair me store krwa do

//        let listing = req.body.listing;
//     // if (!listing.title) {
//     //     throw ExpressError(400, "Tiltle is missing");
//     // }
//     // if (!listing.location) {
//     //     throw ExpressError(400, "Tiltle is missing");  //for schema validation in this method we have to chrck every file
//     // }                                                   //taki koi field vaccent submit na kr de
//     // if (!listing.country) {
//     //     throw ExpressError(400, "Tiltle is missing");
//     // }

//     const newListing = new Listing(listing);//Listing:model
//     await newListing.save();
//     res.redirect("/listings");
// }));
