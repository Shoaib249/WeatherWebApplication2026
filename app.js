document.addEventListener("DOMContentLoaded", () => {
  const search = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");
  let card = document.querySelector(".card");
  const body = document.querySelector("body");

  const key = "13d3557911484c69e8e4e29b09c4f1da";

  // Function to change background dynamically
  const setBackground = (weather) => {
    switch (weather.toLowerCase()) {
      case "clear":
        body.style.background = "linear-gradient(135deg, #f9d423, #ff4e50)";
        break;
      case "clouds":
        body.style.background = "linear-gradient(135deg, #757f9a, #d7dde8)";
        break;
      case "rain":
        body.style.background = "linear-gradient(135deg, #1f1c2c, #928dab)";
        break;
      case "snow":
        body.style.background = "linear-gradient(135deg, #83a4d4, #b6fbff)";
        break;
      case "mist":
      case "fog":
        body.style.background = "linear-gradient(135deg, #606c88, #3f4c6b)";
        break;
      case "thunderstorm":
        body.style.background = "linear-gradient(135deg, #141e30, #243b55)";
        break;
      default:
        body.style.background = "linear-gradient(135deg, #1033be, #5182e5)";
    }
  };

  const showLoading = () => {
    card.innerHTML = `<p class="loading">Loading weather data...</p>`;
  };

  const getWeather = async (city) => {
    try {
      showLoading();
      let URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
      let response = await fetch(URL);
      let data = await response.json();

      if (data.cod !== 200) {
        card.innerHTML = `<p class="error">City not found. Please try again.</p>`;
        return;
      }

      // Change background based on weather
      setBackground(data.weather[0].main);

      card.innerHTML = `
        <div class="temp-content">
            <div class="img-card">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
                <h2 class="temp">${Math.round(data.main.temp)}°C</h2>
            </div>
        </div>
        <div class="content">
            <h2 class="city-name">${data.name}, ${data.sys.country}</h2>
            <span class="weather">${data.weather[0].description}</span>
        </div>
        <div class="bottom-cards">
          <div class="humidity">
              <img src="images/humidity.svg" alt="Humidity">
              <span>${data.main.humidity}% HUMIDITY</span>
          </div>
          <div class="divider"></div>
          <div class="wind">
              <img src="images/wind.svg" alt="Wind">
              <span>${data.wind.speed} KM/H</span>
          </div>
        </div>
      `;
    } catch (error) {
      card.innerHTML = `<p class="error">Something went wrong. Please try again later.</p>`;
      console.error(error);
    }
  };

  // Search button click
  searchBtn.addEventListener("click", () => {
    if (search.value.trim() !== "") {
      getWeather(search.value);
    }
  });

  // Enter key support
  search.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && search.value.trim() !== "") {
      getWeather(search.value);
    }
  });

  // Auto fetch current location weather
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        card.innerHTML = `<p class="info">Please search for a city above.</p>`;
      }
    );
  }

  // Fetch weather by coordinates
  const getWeatherByCoords = async (lat, lon) => {
    try {
      showLoading();
      let URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
      let response = await fetch(URL);
      let data = await response.json();

      // Change background based on weather
      setBackground(data.weather[0].main);

      card.innerHTML = `
        <div class="temp-content">
            <div class="img-card">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
                <h2 class="temp">${Math.round(data.main.temp)}°C</h2>
            </div>
        </div>
        <div class="content">
            <h2 class="city-name">${data.name}, ${data.sys.country}</h2>
            <span class="weather">${data.weather[0].description}</span>
        </div>
      `;
    } catch (error) {
      card.innerHTML = `<p class="error">Unable to fetch location weather.</p>`;
    }
  };
});
