var cityInput = document.getElementById("city-search");
var searchForm = document.getElementById("user-form");

var searchSubmit = function (event) {
  event.preventDefault();

  var city = cityInput.value.trim();
  localStorage.setItem("city", city);

  if (city) {
    getCoords(city);
    cityInput.value = "";
  } else {
    alert("Please enter a City");
  }
};

var getCoords = function (city) {
  var geoUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=5&appid=b913321cbeef3ffe610df59d6b749231";

  fetch(geoUrl)
    .then(function (response) {
      console.log(response);
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
    "&appid=b913321cbeef3ffe610df59d6b749231";
  fetch(weatherUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data)
            let forecastArray = []
        for (let i = 0; i < data.list.length; i++) {
            const forecastObject = data.list[i];
            const testTime = forecastObject.dt_txt.split(" ")[1]
            if(testTime==="12:00:00") {
                forecastArray.push(forecastObject)
            }
            
        }
        displayForecast(forecastArray, data.name)
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weatherorg");
    });
};

var getWeather= function (latitude, longitude) {
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
              console.log(data)
            displayWeather(data, data.name);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function (error) {
        alert("Unable to connect to Weatherorg");
      });
      getForecast(latitude,longitude)
  };

var displayForecast = function(array) {;
    array.forEach(function(day){
        var cardDiv = document.createElement("div");
        var cardH4 = document.createElement("h3");
        var tempH4 = document.createElement("h4");
        var humidityH4 = document.createElement("h4");
        var windH4 = document.createElement("h4");
        var dateArr = day.dt_txt.split(" ")[0].split("-");
        var date = dateArr[2] + "/" + dateArr[1];
        cardH4.textContent = date;
        tempH4.textContent = "temperature: " + data.main.temp + "°C";
        humidityH4.textContent = "humidity: " + data.main.humidity + "%";
        windH4.textContent = "wind: " + data.wind.speed + "km/h";
        cardDiv.appendChild(cardH4);
        document.getElementById("day-container").appendChild(cardDiv);

    });
        
    
}

var displayWeather = function (data, city) {
    console.log(data, city)
    //var date = data.dt_txt.split(" ")[0]
    document.querySelector(".city-name").textContent= city
    document.querySelector(".city-temp").textContent = "temperature: " + data.main.temp + "°C"
    document.querySelector(".city-humidity").textContent = "humidity: " + data.main.humidity + "%"
    document.querySelector(".city-wind").textContent = "wind: " + data.wind.speed + "km/h"
};

var displayCities = function (event) {
  event.preventDefault();
  var cityBtn = document.createElement("button");
  cityBtn.textContent = city;
  var cityLiEL = document.createElement("li");
  var cityList = document.getElementById("city-list");
  cityLiEL.append(cityBtn);
  cityList.appendChild(cityLiEL);
};

searchForm.addEventListener("submit", searchSubmit);
