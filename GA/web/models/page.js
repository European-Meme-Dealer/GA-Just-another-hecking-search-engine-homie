const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: String,
  url: String,
  body: Array,
  summary: String,
  lang: String
},
{ collection: 'pages' }
);

module.exports = mongoose.model('Page', pageSchema);
