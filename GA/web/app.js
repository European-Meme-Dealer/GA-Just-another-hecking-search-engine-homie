const express = require('express');
const mongoose = require('mongoose');
const Page = require('./models/page');
const config = require('./config');
const http = require('http');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

mongoose.connect(config.dbURL, { reconnectTries: 5 });

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contacts', (req, res) => {
  res.render('contacts');
});

/*
app.get('/output', (req, res) => {
  fs.readFile('./output.json', (err, json) => {
    let obj = JSON.parse(json);
    let ans = search(obj, req.query.search);

    res.render('output', { obj: ans, easteregg: req.query.search });
  });
});
*/

app.get('/output', (req, res) => {
  Page.find({}, (err, data) => {
    res.render('output', { obj: data, easteregg: req.query.search });
  });
});

function search(obj, searchWord) {
  return obj.filter(
    o =>
      o.body.some(k => k.includes(searchWord.toLowerCase())) || o.title.toLowerCase().includes(searchWord.toLowerCase())
  );
}

server.listen(config.port, () => {
  console.log('listening on *:' + config.port);
});
