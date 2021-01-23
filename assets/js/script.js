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
    $.ajax({
      url: fiveDayURL,
      method: "GET",
    }).then(function (fiveResponse) {
      // 5 DAY BUILD FUNCTION CALLS \\
      dayOne(fiveResponse);
      dayTwo(fiveResponse);
      dayThree(fiveResponse);
      dayFour(fiveResponse);
      dayFive(fiveResponse);
    });

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
    let iconSource = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
    currentImage.attr("src", iconSource);
  }

  // ADDING LISTENER TO GENERATED BUTTONS \\
  $(document).on("click", ".new-city-button", activateNewButton);

  // GENERATED BUTTONS CITY NAME \\
  function activateNewButton() {
    let addedCity = $(this).attr("data-name");
  }

  // DAY 1 OF FIVE DAY \\
  function dayOne(fiveResponse) {
    let dayOneDate = fiveResponse.list[3]["dt_txt"];
    let dayOneIcon = fiveResponse.list[3]["weather"][0]["icon"];
    let dayOneDescription = fiveResponse.list[3]["weather"][0]["description"];
    let dayOneMinTempK = fiveResponse.list[3]["main"]["temp_min"];
    let dayOneMaxTempK = fiveResponse.list[3]["main"]["temp_max"];
    let dayOneHumidity = fiveResponse.list[3]["main"]["humidity"];
    let dayOneMinTempF = (((dayOneMinTempK - 273.15) * 9) / 5 + 32).toFixed(2);
    let dayOneMaxTempF = (((dayOneMaxTempK - 273.15) * 9) / 5 + 32).toFixed(2);
    $("#day-one-date").text(moment().add("1", "day").format("MM-DD-YYYY"));
    let dayOneIconString = `http://openweathermap.org/img/wn/${dayOneIcon}@2x.png`;
    $("#day-one-weather-image").attr("src", dayOneIconString);
    $("#day-one-description").text(dayOneDescription);
    $("#day-one-min-temp").text(`${dayOneMinTempF} F`);
    $("#day-one-max-temp").text(`${dayOneMaxTempF} F`);
    $("#day-one-humidity").text(`${dayOneHumidity} %`);
  }

  // DAY 2 OF FIVE DAY \\
  function dayTwo(fiveResponse) {
    let dayTwoDate = fiveResponse.list[7]["dt_txt"];
    let dayTwoIcon = fiveResponse.list[7]["weather"][0]["icon"];
    let dayTwoDescription = fiveResponse.list[7]["weather"][0]["description"];
    let dayTwoMinTempK = fiveResponse.list[7]["main"]["temp_min"];
    let dayTwoMaxTempK = fiveResponse.list[7]["main"]["temp_max"];
    let dayTwoHumidity = fiveResponse.list[7]["main"]["humidity"];
    let dayTwoMinTempF = (((dayTwoMinTempK - 273.15) * 9) / 5 + 32).toFixed(2);
    let dayTwoMaxTempF = (((dayTwoMaxTempK - 273.15) * 9) / 5 + 32).toFixed(2);
    $("#day-two-date").text(moment().add("2", "day").format("MM-DD-YYYY"));
    let dayTwoIconString = `http://openweathermap.org/img/wn/${dayTwoIcon}@2x.png`;
    $("#day-two-weather-image").attr("src", dayTwoIconString);
    $("#day-two-description").text(dayTwoDescription);
    $("#day-two-min-temp").text(`${dayTwoMinTempF} F`);
    $("#day-two-max-temp").text(`${dayTwoMaxTempF} F`);
    $("#day-two-humidity").text(`${dayTwoHumidity} %`);
  }

  // DAY 3 OF FIVE DAY \\
  function dayThree(fiveResponse) {
    let dayThreeDate = fiveResponse.list[15]["dt_txt"];
    let dayThreeIcon = fiveResponse.list[15]["weather"][0]["icon"];
    let dayThreeDescription =
      fiveResponse.list[15]["weather"][0]["description"];
    let dayThreeMinTempK = fiveResponse.list[15]["main"]["temp_min"];
    let dayThreeMaxTempK = fiveResponse.list[15]["main"]["temp_max"];
    let dayThreeHumidity = fiveResponse.list[15]["main"]["humidity"];
    let dayThreeMinTempF = (((dayThreeMinTempK - 273.15) * 9) / 5 + 32).toFixed(
      2
    );
    let dayThreeMaxTempF = (((dayThreeMaxTempK - 273.15) * 9) / 5 + 32).toFixed(
      2
    );
    $("#day-three-date").text(moment().add("3", "day").format("MM-DD-YYYY"));
    let dayThreeIconString = `http://openweathermap.org/img/wn/${dayThreeIcon}@2x.png`;
    $("#day-three-weather-image").attr("src", dayThreeIconString);
    $("#day-three-description").text(dayThreeDescription);
    $("#day-three-min-temp").text(`${dayThreeMinTempF} F`);
    $("#day-three-max-temp").text(`${dayThreeMaxTempF} F`);
    $("#day-three-humidity").text(`${dayThreeHumidity} %`);
  }

  // DAY 4 OF FIVE DAY \\
  function dayFour(fiveResponse) {
    let dayFourDate = fiveResponse.list[23]["dt_txt"];
    let dayFourIcon = fiveResponse.list[23]["weather"][0]["icon"];
    let dayFourDescription = fiveResponse.list[23]["weather"][0]["description"];
    let dayFourMinTempK = fiveResponse.list[23]["main"]["temp_min"];
    let dayFourMaxTempK = fiveResponse.list[23]["main"]["temp_max"];
    let dayFourHumidity = fiveResponse.list[23]["main"]["humidity"];
    let dayFourMinTempF = (((dayFourMinTempK - 273.15) * 9) / 5 + 32).toFixed(
      2
    );
    let dayFourMaxTempF = (((dayFourMaxTempK - 273.15) * 9) / 5 + 32).toFixed(
      2
    );
    $("#day-four-date").text(moment().add("4", "day").format("MM-DD-YYYY"));
    let dayFourIconString = `http://openweathermap.org/img/wn/${dayFourIcon}@2x.png`;
    $("#day-four-weather-image").attr("src", dayFourIconString);
    $("#day-four-description").text(dayFourDescription);
    $("#day-four-min-temp").text(`${dayFourMinTempF} F`);
    $("#day-four-max-temp").text(`${dayFourMaxTempF} F`);
    $("#day-four-humidity").text(`${dayFourHumidity} %`);
  }

  // DAY 5 OF FIVE DAY \\
  function dayFive(fiveResponse) {
    let dayFiveDate = fiveResponse.list[7]["dt_txt"];
    let dayFiveIcon = fiveResponse.list[7]["weather"][0]["icon"];
    let dayFiveDescription = fiveResponse.list[3]["weather"][0]["description"];
    let dayFiveMinTempK = fiveResponse.list[7]["main"]["temp_min"];
    let dayFiveMaxTempK = fiveResponse.list[7]["main"]["temp_max"];
    let dayFiveHumidity = fiveResponse.list[7]["main"]["humidity"];
    let dayFiveMinTempF = (((dayFiveMinTempK - 273.15) * 9) / 5 + 32).toFixed(
      2
    );
    let dayFiveMaxTempF = (((dayFiveMaxTempK - 273.15) * 9) / 5 + 32).toFixed(
      2
    );
    $("#day-five-date").text(moment().add("5", "day").format("MM-DD-YYYY"));
    let dayFiveIconString = `http://openweathermap.org/img/wn/${dayFiveIcon}@2x.png`;
    $("#day-five-weather-image").attr("src", dayFiveIconString);
    $("#day-five-description").text(dayFiveDescription);
    $("#day-five-min-temp").text(`${dayFiveMinTempF} F`);
    $("#day-five-max-temp").text(`${dayFiveMaxTempF} F`);
    $("#day-five-humidity").text(`${dayFiveHumidity} %`);
  }
});
