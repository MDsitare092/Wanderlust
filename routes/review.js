const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utlils/wrapAsync.js");
const ExpressError = require("../utlils/ExpressError.js");
const Review = require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
//controller review
const reviewController = require("../controllers/reviews.js");



//Reviews  Post Route
router.post("/",
   isLoggedIn,
    validateReview,
     wrapAsync( reviewController.createReview));

//delete review route
router.delete("/:reviewId",
   isLoggedIn,
   isReviewAuthor,
   wrapAsync(reviewController.deleteReview));

module.exports = router;