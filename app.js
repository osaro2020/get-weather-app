const PORT = process.env.PORT || 4000;
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  //This will send form input to user
  res.sendFile(__dirname + "/index.html");
});

//bodyParser will parse and get cityName from form
app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = API_KEY
  const units = "imperial";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    units;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.set("Content-Type", "text/html");

      // <script>function goBack() {window.history.back();}</script>

      res.write(
        "<h1 style='font-family:sans-serif; color:#035AA6;'>The temperature in " +
        query +
        " is " +
        temp +
        " degrees Farenheight.</h1>"
      );
      res.write(
        "<h1 style='font-family:sans-serif; color:#035AA6;'>The weather is currently " + weatherDescription + ".</h1>"
      );
      res.write("<img style='margin-left:auto; margin-right:auto; width:15%;' src=" + imageURL + ">");
      res.write(
        "<button style='color:blue; display:flex; justify-content:center; align-items:center;' onclick='goBack()'>Go Back</button> <script>function goBack() {window.history.back();}</script>"
      );
      res.write("<body style='background-color:#BFE9DB;'></body>")
      res.end();
    });
  });
});

app.listen(PORT, function () {
  console.log("Server is running on port 4000.");
});