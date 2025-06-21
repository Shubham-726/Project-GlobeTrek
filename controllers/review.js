const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);  //comment or review pass ho jyegi newReview ke pass
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");        
    req.flash("success", "New Review Created")
    res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });     //review array ke under jo v review reviewId se match krega usko pull i.e remove krdenge
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`);
}