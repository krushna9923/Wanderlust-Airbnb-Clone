const Listing = require("../models/listing");
const geocodeLocation = require("../utils/geocode");


module.exports.findNearby = async (req,res) =>{
    try{
        const {lng,lat} = req.query;//pass coordinate in query string
        const listings = await Listing.find({
            location:{
                $near:{
                    $geometry:{type:"Point",coordinates: [parseFloat(lng),parseFloat(lat)]},
                    $maxDistance:10000 //10 km in meters

                }
            }
        });
        res.render("listings/nearby.ejs",{listings});

    } catch (error){
        console.error("Error finding nearby lisitng:",error);
        req.flash("error","Could not find nearby listings");
        res.redirect("/listings");
        
    }
};
//edited for work search bar and shortcut like mountain etc
module.exports.index = async (req, res) => {
    const { category, search } = req.query;
    let allListings;
    if (search) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
            ]
        });
    } else if (category) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings, category, search });
};
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};
const mongoose = require("mongoose");
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
     if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Listing ID!");
        return res.redirect("/listings");
    }
    const listing = await Listing.findById(id)
     .populate({
        path:"reviews",
        populate:{
            path: "author"
        },
       })

     .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    console.log(url,"..", filename);
    console.log("DEBUG req.userL:",req.user);
    
    const locationString = req.body.listing.location;

    const coords = await geocodeLocation(locationString);

    if (!coords) { 
       req.flash("error","Invalid location");
       return res.redirect("/listings/new");

    } 

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.location = {
        type:"Point",
        coordinates: [coords.lng,coords.lat],

    };

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing) {
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    
    //OPTIONAL BUT STRONGLY RECOMMENDEDD (authorization)
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });

};

module.exports.updateListing = async (req, res) => {
        const { id } = req.params;
        let listing =  await Listing.findById(id);

        

     
        
        if(!listing) {
            req.flash("error","Listing not found");
            return res.redirect("/listings");

        }
        if(!listing.owner.equals(req.user._id)){
            req.flash("error", "You do not have permission to update this listing");
            return res.redirect(`/listings/${id}`);

        }
        //update basic fields
        listing.set(req.body.location);

        //Refresh coordinate if location changed
        if(req.body.listing.location){
            const coords = await geocodeLocation(req.body.listing.location);
            if(!coords){
                req.flash("error","Invalid location - could not geocode");
                return res.redirect(`/listing/${id}/edit`);
            }
            listing.location = {
                  type: "Point",
                 coordinates: [coords.lng, coords.lat]
            };
        }
        // update image if a new file was uploadecd
        if(req.file) {
            listing.image = {
                url:req.file.path,
                filename:req.file.filename
            };
            
        }
        // save lisitng after all updates
        await listing.save();

        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    //Authorization check
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to delete this listing");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}; 