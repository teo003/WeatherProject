//-------import required modules-----------
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

//------code to make everything work together------
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static("public"));

//--------current year-----------
const year = new Date().getFullYear();

//-----------get home page------------
app.get("/", function(req, res) {
  res.render("index", {
    year: year
  });
});

//----------post home page-----------
app.post("/", function(req, res){
  console.log(req.body.cityName);

  const query = req.body.cityName;
  const apiKey = "YOUR_API_KEY";
  const units = "metric";
  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

  https.get(weatherUrl, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescr = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.render("displayData", {
        query: query,
        temp: temp,
        weatherDescr: weatherDescr,
        imageURL: imageURL,
        year: year
      });
    });
  });
});

//----------listen on port 3000----------
app.listen(3000, function(req, res){
  console.log("Server is running on port 3000.");
});
