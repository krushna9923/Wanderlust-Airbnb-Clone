async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "majorproject-app (your@email.com)",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Nominatim error response:", errorText);
    throw new Error(`Geocoding failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }

  return null;
}

module.exports = geocodeLocation;