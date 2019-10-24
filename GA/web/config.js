const config = {};

config.port = process.env.PORT || 8080;
config.dbURL = process.env.DATABASEURL || 'mongodb://localhost/searchengine'

module.exports = config;
