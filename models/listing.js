const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listing image"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1743704458905-9edf92294d7e?q=80&w=2108&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1743704458905-9edf92294d7e?q=80&w=2108&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        }
    },                                  //default link assign ho jyega agar hm koi link nhide nge
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true  
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } }); //listing ke under jitni v review hai uski list bna lenge
    }
})         //or agar hamare  review ke under listing wali id ka part hoga toh wo pura delete ho jyega

const Listing = mongoose.model("Listing", listingSchema);//this will create collection listing
module.exports = Listing;