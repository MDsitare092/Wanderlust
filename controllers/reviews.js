const Listing = require("../models/listing");
const Review = require("../models/review");

//create Review
module.exports.createReview = async(req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   //author
   newReview.author = req.user._id;

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash("success", "New Review Creact!");
   res.redirect(`/listings/${listing._id}`);
};

//delete Review
module.exports.deleteReview = async(req, res)=>{
   let {id, reviewId} = req.params;

   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Review!");
   res.redirect(`/listings/${id}`);
};