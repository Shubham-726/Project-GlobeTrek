const joi = require('joi');


module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.object({
            // url: joi.string().allow("", null),
            url: joi.string().uri().empty("").default("https://images.unsplash.com/photo-1743704458905-9edf92294d7e?q=80&w=2108&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
        })
    }).required(),
})


module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
})


