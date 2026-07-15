const Booking = require("../models/booking");
const Listing = require("../models/listing");



module.exports.createBooking = async (req,res) =>{
    const { id }  = req.params;
    const listing = await Listing.findById(id);


    if(!listing) {
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    const { checkIn, checkOut } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate =  new Date(checkOut);

    const nights = Math.ceil((checkOutDate - checkInDate) /(1000 * 60 * 60 * 24));

    if(nights <=0) {
        req.flash("error","Check-out data must be after check -in date!");
        return res.redirect(`/listings/${id}`);

    }

    const totalPrice = nights * listing.price;

    const newBooking = new Booking({
        listing: id,
        user: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
    });

    await newBooking.save();
    req.flash("success",`Booking confirmed! Total: ₹${totalPrice.toLocaleString("en-IN")}`);
    res.redirect(`/listings/${id}`);
}

module.exports.myBookings = async (req,res) =>{
    const booking = await Booking.find({user: req.user._id})
        .populate("listing")
        .sort({ createdAt: -1});
   res.render("bookings/my-bookings.ejs", { bookings: booking });

};