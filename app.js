
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


//console.log("Session Secret:",process.env.SESSION_SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const dburl = process.env.ATLASDB_URL;
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session  = require("express-session");
const { MongoStore} = require('connect-mongo');
console.log(MongoStore);

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");//for booking system



main()
   .then(() =>{
    console.log("connected to DB");
   })
   .catch((err) =>{
    console.log(err);
   });
async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));





const store =  new MongoStore({
  mongoUrl: dburl, // your Atlas connection string
  crypto: {
    secret:process.env.SESSION_SECRET // optional encryption for session data
  },
  touchAfter: 24 * 3600, // time in seconds (1 day)
});

store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOption = {
  store,
  secret: process.env.SESSION_SECRET, // keep this in .env for security
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash("success");  
    res.locals.error  = req.flash("error");  
    res.locals.currUser = req.user;
    next();

});

console.log("BEFORE ROOT ROUTE");
app.get("/", (req, res) => {
   console.log("ROOT ROUTE HIT");
    res.send("ROOT ROUTE WORKING");
});

console.log("AFTER ROOT ROUTE");

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/listings/:id/bookings",bookingRouter);
app.use("/",userRouter);
app.use("/",bookingRouter);



//404 handler
app.use((req,res) =>{
   
   res.status(404).send("Page not Found");
})

app.use((err,req,res,next)=>{
    let{statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
   // res.status(statusCode).send(message);

});
     


app.listen(8080,() =>{
    console.log("server is listening to port 8080")
});