const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: String,
  url: String,
  body: Array,
  summary: Array
},
{collection: 'pages'}
);

module.exports = mongoose.model('Page', pageSchema);
