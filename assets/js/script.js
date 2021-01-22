$(document).ready(function () {
  //TODAYS CURRENT DATE
  let currentDate = moment().format("L");

  let cityName;

  $("#search-submit").on("click", function (event) {
    event.preventDefault();

    cityName = $("#city-name-input").val().trim();

    //API KEY \\
    let APIKey = "3a623ea6ade278ada9b6b26990b8755d";

    // URL TO API FOR CURRENT WEATHER BY CITY \\
    let cityQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;

    // URL TO API FOR 2HR/5DAY FORECAST BY CITY \\
    let fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}`;

    // ONE DAY WEATHER API \\
    $.ajax({
      url: cityQueryURL,
      method: "GET",
    }).then(function (currentResponse) {
      // CALL FUNCTION TO INSERT CURRENT CITY INFO \\
      insertCurrentInfo(currentResponse);
    });

    // FIVE DAY WEATHER API \\
    // $.ajax({
    //   url: fiveDayURL,
    //   method: "GET",
    // }).then(function (fiveResponse) {
    //   console.log(fiveResponse);
    // });

    //BUILD CITY ARRAY \\
    citiesArr.push(cityName);

    //CALL FUNCTION TO ADD CITY BUTTONS \\
    buildButtons();

    // CLEAR SEARCH TEXT BOX \\
    document.getElementById("city-name-input").value = "";
  });

  //BUILD ARRAY FOR EACH ADDED CITY \\
  let citiesArr = [];

  // BUILD BUTTONS FROM SEARCH BAR \\
  function buildButtons() {
    $("#city-buttons-added").empty();

    // BUILDING BUTTONS LOOP-RUNS AT EACH SUBMIT \\
    for (let i = 0; i < citiesArr.length; i++) {
      // CREATE NEW BUTTON ELEMENT \\
      let newCityButton = $("<button>");
      let lineBreak = $("<br>");

      // ADD CLASS TO BUTTON \\
      newCityButton.addClass("btn btn-primary new-city-button");
      // newCityButton.addClass("btn");

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

  function insertCurrentInfo(currentResponse) {
    console.log(currentResponse);
    // CURRENT CITY AND DATE DISPLAY \\
    let currentCityandDateDisplay = $("#current-city-date");
    currentCityandDateDisplay.text(`${currentResponse.name} (${currentDate})`);

    // CURRENT TEMPERATURE DISPLAY \\
    let currentCityTempDisplay = $("#current-temperature");
    let currentTempF = (
      ((currentResponse.main.temp - 273.15) * 9) / 5 +
      32
    ).toFixed(2);
    currentCityTempDisplay.text(`Temperature ${currentTempF} F`);

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
    console.log(currentIcon);
    let iconSource = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
    currentImage.attr("src", iconSource);
  }

  // ADDING LISTENER TO GENERATED BUTTONS \\
  $(document).on("click", ".new-city-button", activateNewButton);

  function activateNewButton() {
    let city = $(this).attr("data-name");
    console.log(city);
  }
});
