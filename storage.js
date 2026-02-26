function saveFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// ✅ Weather cache with 10 min expiry
function cacheWeather(city, data) {
  const cache = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(`weather_${city}`, JSON.stringify(cache));
}

function getCachedWeather(city) {
  const cache = JSON.parse(localStorage.getItem(`weather_${city}`));
  if (!cache) return null;

  const TEN_MIN = 10 * 60 * 1000;
  if (Date.now() - cache.timestamp < TEN_MIN) {
    return cache.data;
  }

  return null;
}