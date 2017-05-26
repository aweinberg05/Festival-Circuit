$(document).ready(function(){

  <remove name="OPTIONSVerbHandler" />

  var input = $('input');
  var button = $('button');

function getEdm (search){
  $.ajax({

  url: "http://api.eventful.com/json/events/search?app_key=F7jWpmt2FtpRWBCX&keywords=" + search + "&date=Future",
  success: function(data){
  console.log(data)
  handleResponse(data, search)
  }
})
};


  function getData (movieTitle){
    $.ajax({
    url: "http://www.omdbapi.com/?t=" +movieTitle,
    success: function(data){
    console.log(data)
    //"data" prints out an object containing all of the movie's info (title, image, duration, etc.).
    //the function "handleResponse" is defined below but invoked here:
    handleResponse(data)

button.click(function(event){
  event.preventDefault()
  var search = input.val();
  getEdm(search);
})

function appendWeather (forecast, date){
var forecastPara= $('#forecast');
var datePara = $('.date');
forecastPara.html(forecast)
datePara.html(date)
}

function handleResponse (data, city){
var date = moment(data.dt*1000).format("MMMM Do YYYY")

//constructor function
var forecast =
  `<p> In ${city.toUpperCase()} it's ${Math.round(data.main.temp)} degrees Farenheit</p>
  <p>Current Conditions: ${data.weather[0].main}</p>
  <p>Sunrise: ${moment(data.sys.sunrise*1000).format("h:mm:ss a' ")}</p>
  <p>Sunset: ${moment(data.sys.sunset*1000).format("h:mm:ss a'")}</p>
  <p> Wind Speed: ${data.wind.speed}</p>`

//JSON.stringify(data.weather[0]);
appendWeather(forecast, date)
};
}); // ends doc.ready//
