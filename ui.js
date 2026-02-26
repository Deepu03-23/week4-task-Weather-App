function showLoading(state) {
  document.getElementById("loading").classList.toggle("hidden", !state);
}

function showError(msg) {
  const error = document.getElementById("error");
  error.textContent = msg;
  error.classList.remove("hidden");
}

function updateCurrentWeather(data, unit) {
  document.getElementById("locationName").textContent =
    `${data.name}, ${data.sys.country}`;
  document.getElementById("lastUpdated").textContent =
    new Date().toLocaleString();

  document.getElementById("temp").textContent =
    `${data.main.temp}° (Feels like: ${data.main.feels_like}°)`;

  document.getElementById("condition").textContent =
    data.weather[0].description;

  document.getElementById("humidity").textContent =
    `${data.main.humidity}%`;

  document.getElementById("wind").textContent =
    `${data.wind.speed} ${unit === "metric" ? "km/h" : "mph"}`;

  document.getElementById("pressure").textContent =
    `${data.main.pressure} hPa`;
}

function getWeatherIcon(condition) {
  condition = condition.toLowerCase();

  if (condition.includes("clear")) return "☀️";
  if (condition.includes("cloud")) return "🌤️";
  if (condition.includes("rain")) return "🌧️";
  if (condition.includes("storm")) return "⛈️";
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("mist") || condition.includes("fog")) return "🌫️";

  return "🌡️"; // default icon
}

function updateForecast(data) {
  const forecastDiv = document.getElementById("forecastList");
  forecastDiv.innerHTML = "";

  const daily = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  daily.slice(0, 5).forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toDateString().slice(0, 10);

    const icon = getWeatherIcon(day.weather[0].description);

    forecastDiv.innerHTML += `
      <p>
        ${dayName}: ${icon} 
        ${Math.round(day.main.temp_max)}° / 
        ${Math.round(day.main.temp_min)}°
      </p>
    `;
  });
}

function renderFavorites() {
  const list = document.getElementById("favoritesList");
  list.innerHTML = "";
  getFavorites().forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => loadWeather(city);
    list.appendChild(li);
  });
}

function renderAutocomplete(results) {
  const list = document.getElementById("autocompleteList");
  list.innerHTML = "";

  results.forEach(city => {
    const div = document.createElement("div");
    div.classList.add("autocomplete-item");
    div.textContent = `${city.name}, ${city.country}`;
    div.onclick = () => {
      loadWeather(city.name);
      list.innerHTML = "";
    };
    list.appendChild(div);
  });
}