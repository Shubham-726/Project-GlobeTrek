const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,   //note key ka name ppermanent hai cloud_name,api_key,api_secret bcz h, config krke de rhe
    api_secret: process.env.CLOUD_API_SECRET
})


const storage = new CloudinaryStorage({  //code given on multer-storage-cloudinary npm
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ["png", "jpg", "jpeg"], //hm ye ye typpe ki file save krwa skte this line we chaged
        // format: async (req, file) => 'png', // supports promises as well
    },
});


module.exports={
    cloudinary,
    storage
}