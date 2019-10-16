const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contacts", (req, res) => {
  res.render("contacts");
});

app.get("/output", (req, res) => {
  fs.readFile("./output.json", (err, json) => {
    let obj = JSON.parse(json);
    let ans = search(obj, req.query.search);

    res.render("output", { obj: ans, easteregg: req.query.search });
  });
});

function search(obj, searchWord) {
  return obj.filter(
    o =>
      o.body.some(k => k.includes(searchWord.toLowerCase())) || o.title.toLowerCase().includes(searchWord.toLowerCase())
  );
}

server.listen(3000, () => {
  console.log("listening on *:3000");
});
