// backfillCoords.js
const mongoose = require("mongoose");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


// Connect to the correct database
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define your Listing model
const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  lat: Number,
  lng: Number,
});

const Listing = mongoose.model("Listing", listingSchema);

async function geocodeLocation(location, country) {
  const query = encodeURIComponent(`${location}, ${country}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const res = await fetch(url, { headers: { "User-Agent": "wanderlust-app" } });
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (err) {
    console.error("Error geocoding:", err);
  }
  return null;
}

async function backfill() {
  const listings = await Listing.find({});
  for (let listing of listings) {
    if (!listing.lat || !listing.lng) {
      console.log(`Geocoding: ${listing.title} (${listing.location}, ${listing.country})`);
      const coords = await geocodeLocation(listing.location, listing.country);
      if (coords) {
        listing.lat = coords.lat;
        listing.lng = coords.lng;
        await listing.save();
        console.log(`Updated ${listing.title} → lat: ${coords.lat}, lng: ${coords.lng}`);
      } else {
        console.log(`Could not geocode ${listing.title}`);
      }
    }
  }
  mongoose.connection.close();
}

backfill();
