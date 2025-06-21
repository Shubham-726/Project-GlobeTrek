const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); // ✅ fixed
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs"); //  ✅ fixed
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing }); // ✅ fixed
}

module.exports.createListing = async (req, res, next) => { //passed validate listing
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location, //jis jagah ki coordinate chahiye usko query me pass krte hai
        limit: 1
    })
            .send();
            
    let url = req.file.path;
    let filename = req.file.filename; // console.log(filename,"...",url);

    const newListing = new Listing(req.body.listing);//Listing:model
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
    newListing.geometry = response.body.features[0].geometry;

    savedListing = await newListing.save();
    console.log(savedListing);
    
    req.flash("success", "New Listing Created")
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit", { listing, originalImgUrl }); // ✅ fixed
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });//This is called the spread syntax in JavaScript. It "spreads" the key-value pairs from the req.body.listing object into a new object.

    if (typeof req.file !== "undefined") {  //agar file update kiye h new image upload kiye tb hi ye kam kr rhe honge agar new file uplaod nhi kiye h req.fileundefined hoga
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);//to redirect to show route  //by writing { ...req.body.listing } we are effectively doing title: req.body.listing.title, and so on
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");
}