var cityInput = document.getElementById("city-search");
var searchForm = document.getElementById("user-form");

var searchSubmit = function (event) {
  event.preventDefault();

  var city = cityInput.value.trim();

  localStorage.setItem("searched-city", city);

  if (city) {
    getCoords(city);
    cityInput.value = "";
  } else {
    alert("Please enter a City");
  }
  displayCities();
};

var getCoords = function (city) {
  var geoUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=5&appid=b913321cbeef3ffe610df59d6b749231";

  fetch(geoUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var latitude = data[0].lat;
          var longitude = data[0].lon;
          getWeather(latitude, longitude);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
    });
};

var getForecast = function (latitude, longitude) {
  var weatherUrl =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=metric&appid=b913321cbeef3ffe610df59d6b749231";
  fetch(weatherUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          let forecastArray = [];
          for (let i = 0; i < data.list.length; i++) {
            const forecastObject = data.list[i];
            const testTime = forecastObject.dt_txt.split(" ")[1];
            if (testTime === "12:00:00") {
              forecastArray.push(forecastObject);
            }
          }
          displayForecast(forecastArray);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weatherorg");
    });
};

var getWeather = function (latitude, longitude) {
  var weatherUrl =
    "http://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=metric&appid=b913321cbeef3ffe610df59d6b749231";
  fetch(weatherUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayWeather(data, data.name);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weatherorg");
    });
  getForecast(latitude, longitude);
};

var displayForecast = function (array) {
  var container = document.getElementById("day-container");
  container.textContent = "";
  array.forEach(function (day) {
    var cardDiv = document.createElement("div");
    cardDiv.setAttribute("id", "weather-card");
    var cardH4 = document.createElement("h3");
    var tempH4 = document.createElement("h4");
    var humidityH4 = document.createElement("h4");
    var windH4 = document.createElement("h4");
    var imageEl = document.createElement("img");
    var dateArr = day.dt_txt.split(" ")[0].split("-");
    var date = dateArr[2] + "/" + dateArr[1];
    imageEl.src =
      "https://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";
    cardH4.textContent = date;
    tempH4.textContent = "temperature: " + day.main.temp + "°C";
    humidityH4.textContent = "humidity: " + day.main.humidity + "%";
    windH4.textContent = "wind: " + day.wind.speed + "km/h";
    cardDiv.append(cardH4, imageEl, tempH4, humidityH4, windH4);
    document.getElementById("day-container").appendChild(cardDiv);
  });
};

var displayWeather = function (data, city) {
  var iconDiv = document.getElementById("weather-icon");
  iconDiv.textContent = "";
  var dayImage = document.createElement("img");
  dayImage.src =
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
  iconDiv.append(dayImage);
  document.querySelector(".city-name").textContent =
    "Today's Forecast for " + city;
  document.querySelector(".city-temp").textContent =
    "temperature: " + data.main.temp + "°C";
  document.querySelector(".city-humidity").textContent =
    "humidity: " + data.main.humidity + "%";
  document.querySelector(".city-wind").textContent =
    "wind: " + data.wind.speed + "km/h";
};

var displayCities = function () {
  var savedCity = localStorage.getItem("searched-city");  
  var cityBtn = document.createElement("button");
  cityBtn.setAttribute("id", "city-button");
  cityBtn.textContent = savedCity;
  var cityLiEL = document.createElement("li");
  var cityList = document.getElementById("city-list");
  cityLiEL.append(cityBtn);
  cityList.appendChild(cityLiEL);

  cityBtn.addEventListener("click", getCoords(savedCity))
};

searchForm.addEventListener("submit", searchSubmit);

