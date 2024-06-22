const cityFormEl = document.querySelector("#city-form");
const historyButtonsEl = document.querySelector("#history-buttons");
const cityInputEl = document.querySelector("#cityname");
const weatherContainerEl = document.querySelector("#weather-container");
const forecastContainerEl = document.querySelector("#forecast-container");
const citySearchTerm = document.querySelector("#city-search-term");

const apiKey = "85857869e938505a57be7c6968414eb8";

const formSubmitHandler = function (event) {
  event.preventDefault();

  if (city) {
    getCityWeather(city);

    cityInputEl.value = "";
  } else {
    alert("Please enter a city name");
  }
};

const buttonClickHandler = function (event) {
  const city = event.target.getAttribute("data-city");

  if (city) {
    getCityWeather(city);
  }
};

const getCityWeather = function (city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data, city);
          saveCityToHistory(city);
          getCityForecast(city);
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

const getCityForecast = function (city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayForecast(data);
        });
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

const displayWeather = function (data, city) {
  weatherContainerEl.innerHTML = "";

  citySearchTerm.textContent = city;

  const weatherEl = document.createElement("div");
  weatherEl.classList = "list-item flex-column";

  const dateEl = document.createElement("h3");
  dateEl.textContent = new Date().toLocaleDateString();

  const iconEl = document.createElement("img");
  iconEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );

  const tempEl = document.createElement("p");
  tempEl.textContent = `Temperature: ${data.main.temp} °F`;

  const humidityEl = document.createElement("p");
  humidityEl.textContent = `Humidity: ${data.main.humidity}%`;

  const windEl = document.createElement("p");
  windEl.textContent = `Wind Speed: ${data.wind.speed} mph`;

  weatherEl.appendChild(dateEl);
  weatherEl.appendChild(iconEl);
  weatherEl.appendChild(tempEl);
  weatherEl.appendChild(humidityEl);
  weatherEl.appendChild(windEl);

  weatherContainerEl.appendChild(weatherEl);
};

const displayForecast = function (data) {
  forecastContainerEl.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const forecastEl = document.createElement("div");
    forecastEl.classList = "list-item flex-column";

    const dateEl = document.createElement("h3");
    dateEl.textContent = new Date(forecast.dt_txt).toLocaleDateString();

    const iconEl = document.createElement("img");
    iconEl.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`
    );

    const tempEl = document.createElement("p");
    tempEl.textContent = `Temperature: ${forecast.main.temp} °F`;

    const humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${forecast.main.humidity}%`;

    const windEl = document.createElement("p");
    windEl.textContent = `Wind Speed: ${forecast.wind.speed} mph`;

    forecastEl.appendChild(dateEl);
    forecastEl.appendChild(iconEl);
    forecastEl.appendChild(tempEl);
    forecastEl.appendChild(humidityEl);
    forecastEl.appendChild(windEl);

    forecastContainerEl.appendChild(forecastEl);
  }
};

const saveCityToHistory = function (city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];

  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    displayCityHistory();
  }
};

