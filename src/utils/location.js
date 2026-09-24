const locationApiUrl = import.meta.env.VITE_LOCATION_API_URL || "/api/location";

function extractLocationName(payload) {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload)) return payload.map(extractLocationName).find(Boolean) ?? null;
  if (typeof payload === "object") {
    return payload.display_name || payload.locationName || payload.name || payload.location || payload.venue || payload.city || payload.address || null;
  }
  return null;
}

function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    });
  });
}

export async function getCurrentLocationName(fallback) {
  try {
    const position = await getCoordinates();
    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) throw new Error(`Reverse geocoding failed with ${response.status}`);

    const locationName = extractLocationName(await response.json());
    if (locationName) return locationName;
  } catch {
    try {
      const response = await fetch(locationApiUrl);
      if (response.ok) {
        const locationName = extractLocationName(await response.json());
        if (locationName) return locationName;
      }
    } catch {
      // Use the booking location when GPS and API lookup are unavailable.
    }
  }

  return fallback;
}
/*
export async function getAddress(lattitude, longitude){
const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lattitude}&lon=${longitude}`);
const data = await response.json();
return data;
}



*/ 