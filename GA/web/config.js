const config = {};

config.port = process.env.PORT || 8080;
config.dbURL = process.env.DATABASEURL || 'mongodb+srv://Oliver:oliver001@searchenginedatabase-q4fzc.gcp.mongodb.net/searchengine?retryWrites=true&w=majority'

module.exports = config;
