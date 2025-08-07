const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utlils/ExpressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
      
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "yuo logged in to create listing!");
      return res.redirect("/login");
   }
   next();
};

//start me user jish path pr tha..login krne ke baad ush path me automatic chala jayega user
module.exports.saveRedirectUrl = (req, res, next) =>{
   if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
};

//listing ko update,edit,delete....etc karne ke user owner hona chahiye nhi to error show hoga
module.exports.isOwner = async(req, res, next) =>{
   let {id} = req.params;
   let listing = await Listing.findById(id);
   if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "you are not the owner of this listing");
     return res.redirect(`/listings/${id}`);
   }
   next(); 
};

//Agar user ne galat ya adhoora data bheja form se (req.body.listing) me error aayega
module.exports.validateListing = (req, res, next) =>{ 
   let {error} = listingSchema.validate(req.body);
   if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400, errMsg);
   }else{
      next();
   
   }
};

//review validate
module.exports.validateReview = (req, res, next)=>{
   let {error} = reviewSchema.validate(req.body);
   if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400, errMsg);
   }else{
      next();
   }
};

//author,user apna review 'delete' kr sakta hai baki user nhi kr payega
module.exports.isReviewAuthor = async(req, res, next) =>{
   let {id, reviewId} = req.params;
   let review = await Review.findById(reviewId);
   if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "you are not the owner of this review");
     return res.redirect(`/listings/${id}`);
   }
   next(); 
};