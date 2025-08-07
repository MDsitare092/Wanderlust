const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlils/wrapAsync.js");
const Listing= require("../models/listing.js");
//ye middleware ka hai
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
//controller
const listingController = require("../controllers/listings.js");
// multer-> multiple file upload hoga and 'cloudinary app' me save hoga
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



//router.route->  Index route - All listings + create route 'dono ka path same hai'
router.route("/")
.get( wrapAsync (listingController.index) )
// const {title,description, image,price,location}=req.body me aayega
.post(
   isLoggedIn,
   validateListing,
   upload.single("listing[image]"),
   wrapAsync(listingController.createListing));



// New route & create route 
router.get("/new", isLoggedIn , listingController.renderNewForm )

//router.route -> show route + update route + delete
router.route("/:id")
.get(wrapAsync (listingController.showListing) )
.put( isLoggedIn,
      isOwner,
      //multer jo cloudinary me save krega 
      upload.single("listing[image]"),
      validateListing,
      wrapAsync( listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync( listingController.deleteListing));


  //Edit route
router.get("/:id/edit", 
   isLoggedIn,
   isOwner,
   wrapAsync (listingController.renderEditForm) );


module.exports = router;


