let currentUnit = "metric";
let currentCity = "New York";
let map;

/* =========================
   🌙 Auto Dark/Light Mode
========================= */
function applyThemeByTime() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) {
    document.body.classList.remove("dark");
  } else {
    document.body.classList.add("dark");
  }
}
applyThemeByTime();


/* =========================
   🗺️ Initialize Weather Map
========================= */
function initMap(lat, lon) {
  if (!map) {
    map = L.map("map").setView([lat, lon], 8);

    L.tileLayer(
      `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${CONFIG.API_KEY}`,
      { attribution: "Weather Map © OpenWeatherMap" }
    ).addTo(map);
  } else {
    map.setView([lat, lon], 8);
  }
}


/* =========================
   🌤️ Load Weather (Main)
========================= */
async function loadWeather(city) {
  try {
    showLoading(true);
    document.getElementById("error").classList.add("hidden");

    // ✅ Check Cache First
    const cached = getCachedWeather(city);
    if (cached) {
      updateCurrentWeather(cached.current, currentUnit);
      updateForecast(cached.forecast);
      initMap(cached.current.coord.lat, cached.current.coord.lon);
      return;
    }

    // Fetch fresh data
    const current = await fetchCurrentWeather(city, currentUnit);
    const forecast = await fetchForecast(city, currentUnit);

    updateCurrentWeather(current, currentUnit);
    updateForecast(forecast);

    initMap(current.coord.lat, current.coord.lon);

    // Save in cache
    cacheWeather(city, { current, forecast });

    currentCity = city;

  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}


/* =========================
   🔍 Search Button
========================= */
document.getElementById("searchBtn").onclick = () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) loadWeather(city);
};


/* =========================
   🔤 Autocomplete
========================= */
document.getElementById("cityInput")
  .addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) return;

    const results = await fetchAutocomplete(query);
    renderAutocomplete(results);
  });


/* =========================
   🌡️ Unit Toggle
========================= */
document.getElementById("metricBtn").onclick = () => {
  currentUnit = "metric";
  loadWeather(currentCity);
};

document.getElementById("imperialBtn").onclick = () => {
  currentUnit = "imperial";
  loadWeather(currentCity);
};


/* =========================
   📍 Use My Location
========================= */
document.getElementById("locationBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    const res = await fetch(
      `${CONFIG.BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=${currentUnit}&appid=${CONFIG.API_KEY}`
    );

    const data = await res.json();
    loadWeather(data.name);
  });
};


/* =========================
   ⭐ Save Favorite
========================= */
document.getElementById("saveFavorite").onclick = () => {
  saveFavorite(currentCity);
  renderFavorites();
};


/* =========================
   📤 Share Weather
========================= */
document.getElementById("shareBtn").onclick = () => {
  if (navigator.share) {
    navigator.share({
      title: "Weather Update",
      text: `Current weather in ${currentCity}`,
      url: window.location.href
    });
  } else {
    alert("Sharing not supported in this browser");
  }
};


/* =========================
   🚀 Initial Load
========================= */
loadWeather(currentCity);
renderFavorites();
