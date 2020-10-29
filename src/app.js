require("dotenv").config();
const path = require("path");
const express = require("express");
const hbs = require("hbs");

const utils = require("./utils");

const app = express();
const port = process.env.PORT || 3000;

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

// Setup static directory to serve
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Weather", name: "Marco Santos" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About", name: "Marco Santos" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Marco Santos",
    message: "Go to /weather to access the API!",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address)
    return res.send({ error: "You must provide an address" });

  return utils.geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) return res.send({ error });

      return utils.forecast(latitude, longitude, (error, forecastMsg) => {
        if (error) return res.send({ error });

        return res.send({
          forecast: forecastMsg,
          location: location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Marco Santos",
    message: "Help article not found",
    goBackHref: "/help",
    goBackText: "Help",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Marco Santos",
    message: "Page not found",
    goBackHref: "/",
    goBackText: "Home",
  });
});

app.listen(port, () => {
  console.log(`Server is up on Port ${port}.`);
});
