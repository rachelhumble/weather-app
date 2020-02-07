// http://api.openweathermap.org/data/2.5/weather?q=durham&appid=bd1eaecee917e627245ddb88acbe1ae2

var cities = [];
var cityList = $("#city-list");

function renderCities() {
    for (var i = 0; i < cities.length; i++) {
      var newCity = cities[i];
      var li = $("<li>");
      li.text(newCity);
      li.attr("data-index", i);
      cityList.append(li);
    }
  }

  function storage() {
    var storedCitites = JSON.parse(localStorage.getItem("cities"));
  
    if (storedCities !== null) {
      cities = storedCities;
    }

    renderCities();
  }
  
  function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }

$("#search-button").on("click", function(e) {
    e.preventDefault();
    var city = $("#city").val().trim();
    console.log(city);

    if (city === "") {
        return;
      }

      cities.push(city);
    //   city.text("");
    
      storeCities();
      renderCities();

    //curent forecast:
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=bd1eaecee917e627245ddb88acbe1ae2";
    console.log(currentURL);

    $.ajax({
      url: currentURL,
      method: "GET"
    })
      .then(function(response) {
        var cityName = response.name;
        $("#city-title").replaceWith("<p class=title id=city-title>Current weather in "  + cityName + ":</p>");

        var imgIcon = response.weather[0].icon;
        var weatherImg = $("<img>");
        weatherImg.attr("src", "http://openweathermap.org/img/wn/" + imgIcon + "@2x.png");
        weatherImg.attr("alt", "weather icon");
        $("#city-title").append(weatherImg);

        var temp = response.main.temp;
        $("#temp").append("Temperature: " + temp + "ºF");

        var humidity = response.main.humidity;
        $("#humidity").append("Humidity: " + humidity + "%");

        var wind = response.wind.speed;
        $("#wind").append("Wind speed: " + wind + "mph");
    });

    //5 day forecast:
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=bd1eaecee917e627245ddb88acbe1ae2";
    

    $.ajax({
        url: forecastURL,
        method: "GET"
      })
        .then(function(response) {
            console.log(response);
            $("#forecast-title").replaceWith("<p class=title id=forecast-title>Forecast for " + response.city.name + ":</p>");

            var days = [ 2, 10, 18, 26, 34 ];
            for(i = 0; i < days.length; i++) {
                var dayDiv = $("<div>");    
                dayDiv.attr("class", "daily");
                $("#line").append(dayDiv);

                var date = response.list[days[i]].dt_txt;
                var dateDisplay = $("<h4>");
                dayDiv.append(dateDisplay);

                dateDisplay.append(date);

                var imgIcon = response.list[days[i]].weather[0].icon;
                console.log(imgIcon);

                var weatherImg = $("<img>");
                weatherImg.attr("src", "http://openweathermap.org/img/wn/" + imgIcon + "@2x.png");
                weatherImg.attr("alt", "weather icon");
                console.log(weatherImg);
                dayDiv.append(weatherImg);

                var temp = response.list[days[i]].main.temp;
                console.log(temp);
                var tempDisplay = $("<h5>");
                dayDiv.append(tempDisplay);
                tempDisplay.append("Temp: " + temp + "ºF");

                var humidity = response.list[days[i]].main.humidity;
                var humidityDisplay = $("<h5>");
                humidityDisplay.append("Humidity: " + humidity + "%");
                dayDiv.append(humidityDisplay);
            };

    });

});