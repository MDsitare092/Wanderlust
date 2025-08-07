//cloud setup
if(process.env.NODE_ENV !="production"){
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utlils/ExpressError.js");
const session = require("express-session");
//mongo session store
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
//router listings,review
const listingRouter = require("./routes/listing.js");
const reviewRouter  =  require("./routes/review.js");
const userRouter  =  require("./routes/user.js"); 



const dbUrl = process.env.ATLASDB_URL;

 main()
 .then(()=>{
    console.log("connected to DB");
 })
 .catch((err)=>{
    console.log(err);
 });
 async function main(){
    await mongoose.connect(dbUrl);
 }
 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//mongo ko cennect hoga ATLAS database service se
const store = MongoStore.create({
   mongoUrl: dbUrl,
   crypto: {
      secret: process.env.SECRET,
   },
   touchAfter: 24 * 3600,
});
store.on("error", ()=>{
   console.log("ERROR IN MONGO SESSION STORE", err);
});

//Express session
const sessionOptions ={
      store,
      secret: process.env.SECRET ,
      resave: false,
      saveUninitialized: true,
      Cookie:{
         expires: Date.now + 7 * 24 * 60 * 60 * 1000, 
         maxAge: 7 * 60 * 60 * 1000,   
         httpOnly: true,
      },
};

// app.get("/", (req,res)=>{
//    res.send("hii, i am root");
// });



app.use(session(sessionOptions));
app.use(flash());

//passport ke liye 'session' hona jaruri hai
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//user ke reletive jitne bhi information hai sab session ke andar store karwate hai
passport.serializeUser(User.serializeUser());
// aur deserialize me sab remove karwate hai user information ko
passport.deserializeUser(User.deserializeUser());

//Alert show krega 
app.use((req,res, next)=>{
   res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    //login/signup or logout ka kam karega, current user ka id hai
    res.locals.currUser = req.user;
   next();
});



 //router ko add kro
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// Catch-all 404 wrong route
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error-handling middleware form me wrong
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
     res.status(statusCode).render("error.ejs", {message});
});





 app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
 });



