const DEFAULT_COUNTRY_CODE = "PK";

const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const loadingText = document.getElementById("loading");
const errorBox = document.getElementById("error");
const weatherResult = document.getElementById("weather-result");

const cityNameEl = document.getElementById("city-name");
const weatherConditionEl = document.getElementById("weather-condition");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");
const weatherIconEl = document.getElementById("weather-icon");
const tickerTextEl = document.getElementById("ticker-text");

const tickerMessages = [
  "Breaking: Heavy rain expected in northern areas",
  "Sunny weather across most cities today",
  "Storm warning in coastal regions",
  "Weather desk: Mild winds and clear visibility in urban zones",
];
let tickerIndex = 0;

// Local weather dataset for beginner-friendly demo mode (no API key required).
const pakistanCityWeather = {
  karachi: { temp: 32, condition: "Sunny", humidity: 58, wind: 5.6, icon: "01d" },
  lahore: { temp: 29, condition: "Cloudy", humidity: 64, wind: 4.1, icon: "03d" },
  islamabad: { temp: 26, condition: "Rainy", humidity: 72, wind: 3.8, icon: "10d" },
  rawalpindi: { temp: 27, condition: "Cloudy", humidity: 68, wind: 3.5, icon: "03d" },
  faisalabad: { temp: 30, condition: "Sunny", humidity: 54, wind: 4.3, icon: "01d" },
  multan: { temp: 34, condition: "Sunny", humidity: 49, wind: 5.1, icon: "01d" },
  peshawar: { temp: 28, condition: "Rainy", humidity: 66, wind: 4.9, icon: "10d" },
  quetta: { temp: 22, condition: "Storm", humidity: 61, wind: 7.4, icon: "11d" },
  hyderabad: { temp: 31, condition: "Cloudy", humidity: 60, wind: 4.2, icon: "04d" },
  sialkot: { temp: 27, condition: "Rainy", humidity: 74, wind: 3.6, icon: "10d" },
  gujranwala: { temp: 28, condition: "Cloudy", humidity: 65, wind: 3.9, icon: "03d" },
  sukkur: { temp: 35, condition: "Sunny", humidity: 44, wind: 5.8, icon: "01d" },
  bahawalpur: { temp: 33, condition: "Sunny", humidity: 47, wind: 5.3, icon: "01d" },
  mardan: { temp: 26, condition: "Rainy", humidity: 69, wind: 4.0, icon: "10d" },
  abbottabad: { temp: 23, condition: "Cloudy", humidity: 71, wind: 3.2, icon: "03d" },
  gwadar: { temp: 27, condition: "Storm", humidity: 67, wind: 8.1, icon: "11d" },
  skardu: { temp: 18, condition: "Cloudy", humidity: 62, wind: 2.7, icon: "04d" },
  muzaffarabad: { temp: 24, condition: "Rainy", humidity: 76, wind: 3.4, icon: "10d" },
};

function showLoading() {
  loadingText.classList.remove("hidden");
  errorBox.classList.add("hidden");
  weatherResult.classList.add("hidden");
}

function hideLoading() {
  loadingText.classList.add("hidden");
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
  weatherResult.classList.add("hidden");
}

function showWeather(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  weatherConditionEl.textContent = data.weather[0].main;
  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  humidityEl.textContent = `${data.main.humidity}%`;
  windSpeedEl.textContent = `${data.wind.speed} m/s`;

  // Use condition icon code to render a weather icon image.
  const iconCode = data.weather[0].icon;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconEl.alt = data.weather[0].description;

  weatherResult.classList.remove("hidden");
  errorBox.classList.add("hidden");
}

function startTicker() {
  // This rotates weather headlines every few seconds for a live-news effect.
  setInterval(() => {
    tickerIndex = (tickerIndex + 1) % tickerMessages.length;
    tickerTextEl.textContent = tickerMessages[tickerIndex];

    // Restart CSS animation so the new message scrolls from right to left.
    tickerTextEl.style.animation = "none";
    void tickerTextEl.offsetWidth;
    tickerTextEl.style.animation = "";
  }, 4500);
}

function normalizeCityName(city) {
  return city.toLowerCase().split(",")[0].trim();
}

function buildLocalWeatherResponse(city, cityData) {
  // Keep response structure similar to API so DOM update code stays easy to learn.
  return {
    name: city,
    sys: { country: DEFAULT_COUNTRY_CODE },
    weather: [
      {
        main: cityData.condition,
        description: `${cityData.condition.toLowerCase()} weather`,
        icon: cityData.icon,
      },
    ],
    main: {
      temp: cityData.temp,
      humidity: cityData.humidity,
    },
    wind: {
      speed: cityData.wind,
    },
  };
}

async function getWeatherByCity(city) {
  const cityKey = normalizeCityName(city);
  const cityData = pakistanCityWeather[cityKey];

  // Small delay to keep a realistic loading experience.
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!cityData) {
    throw new Error("City not found in local dataset. Try major Pakistan cities.");
  }

  // Data is returned from our custom dataset instead of an external API.
  return buildLocalWeatherResponse(city, cityData);
}

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  showLoading();

  try {
    // Call API helper and wait until live weather data is received.
    const weatherData = await getWeatherByCity(city);

    // Update DOM elements so user can see the latest weather details.
    showWeather(weatherData);
  } catch (error) {
    if (error instanceof TypeError) {
      showError("Network error. Please check your internet connection.");
    } else {
      showError(error.message);
    }
  } finally {
    hideLoading();
  }
});

startTicker();
