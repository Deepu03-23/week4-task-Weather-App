async function fetchCurrentWeather(city, unit) {
  const res = await fetch(
    `${CONFIG.BASE_URL}/weather?q=${city}&units=${unit}&appid=${CONFIG.API_KEY}`
  );
  if (!res.ok) throw new Error("City not found");
  return res.json();
}

async function fetchForecast(city, unit) {
  const res = await fetch(
    `${CONFIG.BASE_URL}/forecast?q=${city}&units=${unit}&appid=${CONFIG.API_KEY}`
  );
  return res.json();
}

async function fetchAutocomplete(query) {
  const res = await fetch(
    `${CONFIG.GEO_URL}?q=${query}&limit=5&appid=${CONFIG.API_KEY}`
  );
  return res.json();
}