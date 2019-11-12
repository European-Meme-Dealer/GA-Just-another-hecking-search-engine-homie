const express = require('express');
const mongoose = require('mongoose');
const Page = require('./models/page');
const config = require('./config');
const http = require('http');

const app = express();
const server = http.createServer(app);

mongoose.connect(config.dbURL, { reconnectTries: 5, useNewUrlParser: true, useUnifiedTopology: true });

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

// app.get('/output', (req, res) => {
//   Page.find({}, (err, data) => {
//     let ans = search(data, req.query.search);
//     res.render('output', { obj: ans });
//   }).lean();
// });

app.get('/output', (req, res) => {
  const data = require('./output.json')
  let ans = search(data, req.query.search.toLowerCase());
  res.render('output', { obj: ans });
});

function search(obj, searchWord) {
  return obj.filter(
    o =>
      Object.keys(o.body)
      .some(k => k.includes(searchWord))|| o.title.toLowerCase().includes(searchWord) && (o.lang.includes('en')))
      .sort((a, b) => (b.body[searchWord] - a.body[searchWord]));
}

server.listen(config.port, () => {
  console.log('listening on *:' + config.port);
});
