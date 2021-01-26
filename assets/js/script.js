$(document).ready(function () {
  // TODAYS CURRENT DATE
  let currentDate = moment().format("L");

  // BUILD ARRAY FOR EACH ADDED CITY \\
  let citiesArr = JSON.parse(localStorage.getItem("citiesArr")) || [];

  let defaultCity = citiesArr[citiesArr.length - 1] ?? "Minneapolis";

  let cityName;

  // KELVIN TO FAHRENHEIT FUNCTION \\
  const newTempF = (input) => Math.trunc(((input - 273.15) * 9) / 5 + 32);

  // BUILD BUTTONS ON PAGE LOAD \\
  buildButtons();

  // RUN API ON PAGE LOAD WITH LAST CITY \\
  getWeather(defaultCity);

  // SUBMIT BUTTON LISTENER \\
  $("#search-submit").on("click", function (event) {
    event.preventDefault();

    cityName = $("#city-name-input").val().trim();

    // ENTRY VALIDATION \\
    if (cityName === "") {
      cityName = defaultCity;
    }

    // API CALL FUNCTION \\
    getWeather(cityName);

    // BUILD CITY ARRAY \\
    citiesArr.push(cityName);

    // LOCAL STORAGE \\
    localStorage.setItem("citiesArr", JSON.stringify(citiesArr));

    // CALL FUNCTION TO ADD CITY BUTTONS \\
    buildButtons();
  });

  // API FUNCTION \\
  function getWeather(cityName) {
    // API KEY \\
    let APIKey = "3a623ea6ade278ada9b6b26990b8755d";

    // URL TO API FOR CURRENT WEATHER BY CITY \\
    let cityQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;

    // ONE DAY WEATHER API \\
    $.ajax({
      url: cityQueryURL,
      method: "GET",
    }).then(function (currentResponse) {
      lat = currentResponse.coord.lat;
      lon = currentResponse.coord.lon;
      // URL TO API FOR UV INDEX \\
      let fiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIKey}`;
      // UV INDEX API \\
      $.ajax({
        url: fiveDayURL,
        method: "GET",
      }).then(function (fiveResponse) {
        let currentUVindex = fiveResponse.current.uvi.toFixed(1);
        currentUVdisplay(currentUVindex);
        dayOne(fiveResponse);
        dayTwo(fiveResponse);
        dayThree(fiveResponse);
        dayFour(fiveResponse);
        dayFive(fiveResponse);
      });

      // CALL FUNCTION TO INSERT CURRENT CITY INFO \\
      insertCurrentInfo(currentResponse);
    });

    // CLEAR SEARCH TEXT BOX \\
    document.getElementById("city-name-input").value = "";
  }

  // BUILD BUTTONS FROM SEARCH BAR \\
  function buildButtons() {
    $("#city-buttons-added").empty();

    // BUILDING BUTTONS LOOP-RUNS AT EACH SUBMIT \\
    for (let i = 0; i < citiesArr.length; i++) {
      // CREATE NEW BUTTON ELEMENT \\
      let newCityButton = $("<button>");
      let lineBreak = $("<br>");

      // ADD CLASS TO BUTTON \\
      newCityButton.addClass("btn btn-primary new-city-button text-capitalize");

      // ADD DATA- ATTRIBUTE \\
      newCityButton.attr("data-name", citiesArr[i]);

      // ADD CITY NAME TEXT TO BUTTON \\
      newCityButton.text(citiesArr[i]);

      // APPEND BUTTON TO DIV \\
      $("#city-buttons-added").prepend(newCityButton, lineBreak);
    }
  }

  // DETERMINE WIND DIRECTION \\
  let windDirectionCalc = function (num) {
    if ((num >= 0 && num <= 45) || (num >= 315 && num <= 360)) {
      return "North";
    } else if (num >= 46 && num <= 135) {
      return "East";
    } else if (num >= 136 && num <= 225) {
      return "South";
    } else if (num >= 226 && num <= 314) {
      return "West";
    } else {
      return "Calm";
    }
  };

  // CURRENT WEATHER CONDITIONS \\
  function insertCurrentInfo(currentResponse) {
    // CURRENT CITY AND DATE DISPLAY \\
    let currentCityandDateDisplay = $("#current-city-date");
    currentCityandDateDisplay.text(`${currentResponse.name} (${currentDate})`);

    // CURRENT TEMPERATURE DISPLAY \\
    let currentCityTempDisplay = $("#current-temperature");
    let currentTempF = newTempF(currentResponse.main.temp);
    currentCityTempDisplay.html(
      `<span>Temperature ${currentTempF}\&#176 F</span>`
    );

    // CURRENT HUMIDITY DISPLAY \\
    let currentCityHumidity = $("#current-humidity");
    currentCityHumidity.text(`Humidity ${currentResponse.main.humidity}%`);

    // CURRENT WIND SPEED \\
    let currentCityWSDisplay = $("#current-wind-speed");
    let num = currentResponse.wind.deg;
    // CALL WIND-DIRECTION FUNCTION
    windDirectionCalc(num);
    let windDirection = windDirectionCalc(num);
    // DISPLAY WIND SPEED AND DIRECTION \\
    currentCityWSDisplay.text(
      `Wind Speed ${currentResponse.wind.speed} MPH ${windDirection}`
    );

    // DISPLAY ICON \\
    let currentImage = $("#current-weather-image");
    let currentIcon = currentResponse.weather[0].icon;
    let iconSource = `https://openweathermap.org/img/wn/${currentIcon}@2x.png`;
    currentImage.attr("src", iconSource);
  }

  // UV INDEX DISPLAY \\
  const currentUVdisplay = (currentUVindex) => {
    let uvDisplay = $("#current-uv-index");
    uvDisplay.css("color", "white");
    if (currentUVindex <= 2) {
      uvDisplay.text(` UV Index: ${currentUVindex} `);
      uvDisplay.css("background-color", "green");
    } else if (currentUVindex > 2 && currentUVindex <= 5) {
      uvDisplay.text(` UV Index: ${currentUVindex} `);
      uvDisplay.css("background-color", "yellow");
      uvDisplay.css("color", "black");
    } else if (currentUVindex > 5 && currentUVindex <= 7) {
      uvDisplay.text(` UV Index: ${currentUVindex} `);
      uvDisplay.css("background-color", "orange");
    } else if (currentUVindex > 7 && currentUVindex <= 10) {
      uvDisplay.text(` UV Index: ${currentUVindex} `);
      uvDisplay.css("background-color", "red");
    } else if (currentUVindex > 10) {
      uvDisplay.text(` UV Index: ${currentUVindex} `);
      uvDisplay.css("background-color", "purple");
    }
  };

  // ADDING LISTENER TO GENERATED BUTTONS \\
  $(document).on("click", ".new-city-button", activateNewButton);

  // GENERATED BUTTONS CITY NAME \\
  function activateNewButton() {
    let addedCity = $(this).attr("data-name");
    getWeather(addedCity);
    console.log(addedCity);
    return addedCity;
  }

  // DAY 1 OF FIVE DAY \\
  function dayOne(fiveResponse) {
    let dayOneIcon = fiveResponse.daily[0]["weather"][0]["icon"];
    let dayOneDescription = fiveResponse.daily[0]["weather"][0]["description"];
    let dayOneTempK = fiveResponse.daily[0]["temp"]["max"];
    let dayOneHumidity = fiveResponse.daily[0]["humidity"];
    let dayOneTempF = newTempF(dayOneTempK);
    $("#day-one-date").text(moment().add("1", "day").format("MM-DD-YYYY"));
    let dayOneIconString = `https://openweathermap.org/img/wn/${dayOneIcon}@2x.png`;
    $("#day-one-weather-image").attr("src", dayOneIconString);
    $("#day-one-description").text(dayOneDescription);
    $("#day-one-temp").html(`<span>${dayOneTempF}\&#176 F</span>`);
    $("#day-one-humidity").text(`H ${dayOneHumidity}%`);
  }

  // // DAY 2 OF FIVE DAY \\
  function dayTwo(fiveResponse) {
    let dayTwoIcon = fiveResponse.daily[1]["weather"][0]["icon"];
    let dayTwoDescription = fiveResponse.daily[1]["weather"][0]["description"];
    let dayTwoTempK = fiveResponse.daily[1]["temp"]["max"];
    let dayTwoHumidity = fiveResponse.daily[1]["humidity"];
    let dayTwoTempF = newTempF(dayTwoTempK);
    $("#day-two-date").text(moment().add("2", "day").format("MM-DD-YYYY"));
    let dayTwoIconString = `https://openweathermap.org/img/wn/${dayTwoIcon}@2x.png`;
    $("#day-two-weather-image").attr("src", dayTwoIconString);
    $("#day-two-description").text(dayTwoDescription);
    $("#day-two-temp").html(`<span>${dayTwoTempF}\&#176 F</span>`);
    $("#day-two-humidity").text(` ${dayTwoHumidity}%`);
  }

  // // DAY 3 OF FIVE DAY \\
  function dayThree(fiveResponse) {
    let dayThreeIcon = fiveResponse.daily[2]["weather"][0]["icon"];
    let dayThreeDescription =
      fiveResponse.daily[2]["weather"][0]["description"];
    let dayThreeTempK = fiveResponse.daily[2]["temp"]["max"];
    let dayThreeHumidity = fiveResponse.daily[2]["humidity"];
    let dayThreeTempF = newTempF(dayThreeTempK);
    $("#day-three-date").text(moment().add("3", "day").format("MM-DD-YYYY"));
    let dayThreeIconString = `https://openweathermap.org/img/wn/${dayThreeIcon}@2x.png`;
    $("#day-three-weather-image").attr("src", dayThreeIconString);
    $("#day-three-description").text(dayThreeDescription);
    $("#day-three-temp").html(`<span>${dayThreeTempF}\&#176 F</span>`);
    $("#day-three-humidity").text(`H ${dayThreeHumidity}%`);
  }

  // // DAY 4 OF FIVE DAY \\
  function dayFour(fiveResponse) {
    let dayFourIcon = fiveResponse.daily[3]["weather"][0]["icon"];
    let dayFourDescription = fiveResponse.daily[3]["weather"][0]["description"];
    let dayFourTempK = fiveResponse.daily[3]["temp"]["max"];
    let dayFourHumidity = fiveResponse.daily[3]["humidity"];
    let dayFourTempF = newTempF(dayFourTempK);
    $("#day-four-date").text(moment().add("4", "day").format("MM-DD-YYYY"));
    let dayFourIconString = `https://openweathermap.org/img/wn/${dayFourIcon}@2x.png`;
    $("#day-four-weather-image").attr("src", dayFourIconString);
    $("#day-four-description").text(dayFourDescription);
    $("#day-four-temp").html(`<span>${dayFourTempF}\&#176 F</span>`);
    $("#day-four-humidity").text(`H ${dayFourHumidity}%`);
  }

  // // DAY 5 OF FIVE DAY \\
  function dayFive(fiveResponse) {
    let dayFiveIcon = fiveResponse.daily[4]["weather"][0]["icon"];
    let dayFiveDescription = fiveResponse.daily[4]["weather"][0]["description"];
    let dayFiveTempK = fiveResponse.daily[4]["temp"]["max"];
    let dayFiveHumidity = fiveResponse.daily[4]["humidity"];
    let dayFiveTempF = newTempF(dayFiveTempK);
    $("#day-five-date").text(moment().add("5", "day").format("MM-DD-YYYY"));
    let dayFiveIconString = `https://openweathermap.org/img/wn/${dayFiveIcon}@2x.png`;
    $("#day-five-weather-image").attr("src", dayFiveIconString);
    $("#day-five-description").text(dayFiveDescription);
    $("#day-five-temp").html(`<span>${dayFiveTempF}\&#176 F</span>`);
    $("#day-five-humidity").text(`H ${dayFiveHumidity}%`);
  }

  // BUTTON TO CLEAR LOCAL STORAGE \\
  $("#clear").on("click", function () {
    localStorage.clear();
    window.location.reload();
  });
});
