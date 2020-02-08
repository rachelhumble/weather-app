jQuery(document).ready(function($){

  var cities = [];
  var cityList = $("#recents");

  function renderCities() {
    for (var i = 0; i < cities.length; i++) {
      var newCity = cities[i];
      var li = $("<li>");
      li.text(newCity);
      li.attr("data-index", i);
      cityList.append(li);
    }
  }
  
  function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  function clearPage() {
    $("#form")[0].reset();
    $("#temp").empty();
    $("#humidity").empty();
    $("#wind").empty();
    $("#uv").empty();
    $("#daily").empty();
  }

  function clearRecents() {
    $("#recents").empty();
  }

  $("#search-button").on("click", function(e) {
    e.preventDefault();

    var city = $("#city").val().trim();

    if (city === "") {
        return;
      }

      cities.push(city);

      storeCities();
      clearRecents();
      renderCities();

    //curent forecast:
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=bd1eaecee917e627245ddb88acbe1ae2";

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

        //UV Index call:
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=bd1eaecee917e627245ddb88acbe1ae2" + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
          url: uvURL,
          method: "GET"
        })
          .then(function(response) {
            var uv = response.value;
            console.log(uv);
            $("#uv").append("UV Index: " + uv);
        });
      });
    
    //5 day forecast:
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=bd1eaecee917e627245ddb88acbe1ae2";
    

    $.ajax({
        url: forecastURL,
        method: "GET"
      })
        .then(function(response) {
            $("#forecast-title").replaceWith("<p class=title id=forecast-title>Forecast for " + response.city.name + ":</p>");

            var days = [ 2, 10, 18, 26, 34 ];
            for(i = 0; i < days.length; i++) {
                var dayDiv = $("<div>");    
                dayDiv.attr("class", "daily");
                $("#daily").append(dayDiv);

                var date = response.list[days[i]].dt_txt;
                var dateDisplay = $("<h4>");
                dayDiv.append(dateDisplay);

                dateDisplay.append(date);

                var imgIcon = response.list[days[i]].weather[0].icon;

                var weatherImg = $("<img>");
                weatherImg.attr("src", "http://openweathermap.org/img/wn/" + imgIcon + "@2x.png");
                weatherImg.attr("alt", "weather icon");
                dayDiv.append(weatherImg);

                var temp = response.list[days[i]].main.temp;
                var tempDisplay = $("<h5>");
                dayDiv.append(tempDisplay);
                tempDisplay.append("Temp: " + temp + "ºF");

                var humidity = response.list[days[i]].main.humidity;
                var humidityDisplay = $("<h5>");
                humidityDisplay.append("Humidity: " + humidity + "%");
                dayDiv.append(humidityDisplay);            
            };     
    });
    clearPage();
  });
});