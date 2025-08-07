const Listing = require("../models/listing");
//mapbox-> token aur geocoding ko access krenge 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index route All listing
module.exports.index = async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", { allListings });
};

//new route
module.exports.renderNewForm = (req, res)=>{
   res.render("listings/new.ejs");
};

//show route
module.exports.showListing = async (req, res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id)
   .populate({
        path: "reviews",
        populate: {path: "author",
         },})
   .populate("owner");
   
   if(!listing){
      req.flash("error", "Listing yuo requested for does not exist! ");
   }
   console.log(listing);
   res.render("listings/show.ejs", {listing});
};

//create route
module.exports.createListing = async(req, res, next)=>{
   
   //geocoding ko access krenge
     let response = await geocodingClient
     .forwardGeocode({
       query: req.body.listing.location,
       limit: 1,
      })
    .send()

    //cloud me save
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    //owner
    newListing.owner = req.user._id;
    //
    newListing.image = {url, filename};
    //geojson ka hai -> neraby location aayega listing location me 
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Creact!");
    res.redirect("/listings");   
};

//edit route
module.exports.renderEditForm =  async(req, res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing){
      req.flash("error", "Listing you requested for does not exist!");
       res.redirect("/listings");
   }
   //edit form me original image aayega but low quality me
   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
   res.render("listings/edit.ejs", {listing, originalImageUrl});
};

//update route
module.exports.updateListing = async(req, res)=>{
   let {id} = req.params;
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    //listing ko edit karne ke badd listing ko update krega aur cloudinary me save hoga
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save();
    }

   req.flash("success", "Listing Updated!");
   res.redirect(`/listings/${id}`);
};

//delete route
module.exports.deleteListing = async(req, res)=>{
   let {id} = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id);
   console.log("deleteListin successfull");
   req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
};