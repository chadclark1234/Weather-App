const APIKey = "3a623ea6ade278ada9b6b26990b8755d";

let cityName = "";
// URL TO API FOR CURRENT WEATHER BY CITY \\
const cityQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=minneapolis&appid=${APIKey}`;

// URL TO API FOR 2HR/5DAY FORECAST BY CITY \\
const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=minneapolis&appid=${APIKey}`;

// BUILDING INPUT CITY ELEMENT \\
let searchCityInputBox = $("<input>");
searchCityInputBox.addClass("cityNameInput");
searchCityInputBox.attr("value");
$(".city").append(searchCityInputBox);

// BUILDING THE SEARCH BUTTON \\
let button = $("<button>");
button.addClass("btn-1");
button.attr("data-name", "btn0");
button.text("Search");
$(".city").append(button);

// SEARCH BUTTON LISTENER \\
$(".btn-1").on("click", function () {
  // CURRENT CITY WEATHER \\
  $.ajax({
    url: cityQueryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
  });

  // 2HR-5 DAY FORCAST \\
  $.ajax({
    url: fiveDayURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
  });
  console.log($(".cityNameInput").val());
});
