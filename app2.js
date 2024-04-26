var http = require('http');
// var url = require('url');
const fs = require('fs');
// const MongoClient = require('mongodb').MongoClient;

// const MONGODB_URI = "mongodb+srv://dbuser123:dbuser123@cluster0.th0qwsg.mongodb.net/?retryWrites=true&w=majority";
var port = process.env.PORT || 3000;

console.log("Right outside of the try");

http.createServer(function (req, res) {
    console.log("Right outside of the try");
}).listen(port);
