const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn ,isOwner,validateListing} = require("../middleware.js");
const geocodeLocation = require("../utils/geocode.js"); 


const listingsController = require("../controllers/listings");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
// Nearby lisitng route
router.get("/nearby",listingsController.findNearby);
module.exports = router;

// INDEX route and CREATE route
router.route("/")
  .get(wrapAsync(listingsController.index))
  .post(
     isLoggedIn,
     validateListing,
     upload.single('listing[image]'),
     wrapAsync(listingsController.createListing)
  );
   

// NEW route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// SHOW route and Update route and DELETE route
router
.route("/:id")
 .get(wrapAsync(listingsController.showListing))
 .put(
     isLoggedIn,
     isOwner,
     upload.single('listing[image]'),
     validateListing,
     wrapAsync(listingsController.updateListing)
    )
 .delete(
     isLoggedIn
     ,isOwner,
     wrapAsync(listingsController.destroyListing)
    );









// EDIT route
router.get("/:id/edit",isLoggedIn,isOwner,
     wrapAsync(listingsController.renderEditForm)
);
router.get("/fix-coordinates",async (req,res)=>{
  const listings = await Listing.find({});
  for (let listing of listings) {
    if(typeof listing.location ==="string") {
      const coords = await geocodeLocation(listing.location);
      if(coords) {
        listing.location = {
          type: "Point",
          coordinates:[coords.lng,coords.lat]
        };
        await listing.save();
        console.log(`Updated ${listing.title}`);

      }
    }
  }
  res.send("Coordinates patched for old listings!");
});

module.exports = router;
