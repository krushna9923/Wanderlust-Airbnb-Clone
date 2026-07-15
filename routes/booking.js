const express = require("express");
const router = express.Router({ mergeParams: true});
const bookingController = require("../controllers/booking");
const { isLoggedIn } = require("../middleware");

//Create booking
router.post("/",isLoggedIn,bookingController.createBooking);


// My booking
router.get("/my-bookings",isLoggedIn,bookingController.myBookings);

module.exports = router;