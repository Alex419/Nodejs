var http = require('http');
var url = require('url');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const MONGODB_URI = "mongodb+srv://dbuser123:dbuser123@cluster0.th0qwsg.mongodb.net/?retryWrites=true&w=majority";
var port = process.env.PORT || 3000;

console.log("Right outside of the try");

http.createServer(async function (req, res) {
    console.log("made it in");
    try {
        console.log("Made it it The try");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        var path = url.parse(req.url).pathname;

        if (req.url == "/") {
            fs.readFile('home.html', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        } else if (path == "/process" && req.method === 'GET') {
            const parsedUrl = url.parse(req.url, true);
            const lookupKey = parsedUrl.query.lookup_key;

            console.log("Lookup Key:", lookupKey);

            const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db('Nodejs');

            let documents;
            if (lookupKey && isNaN(lookupKey.charAt(0))) {
                documents = await db.collection('places').findOne({ place: lookupKey });
            } else {
                documents = await db.collection('places').findOne({ zips: lookupKey });
            }
            await client.close();

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("<h1>Information about where you chose!</h1>");
            if (documents) {
                const place = documents.place;
                const zips = documents.zips.join(', ');
                res.write("<p><strong>Place:</strong> " + place + "</p>");
                res.write("<p><strong>Zip Codes:</strong> " + zips + "</p>");
            } else {
                res.write("<p>Sorry! No place found with the given information.</p>");
            }

            res.write("<a href='/'>Back to Search Page</a>");
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } catch (error) {
        console.log("In the catch");
        console.error('Error processing request:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}).listen(port);
