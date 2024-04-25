const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

const url = "mongodb+srv://dbuser123:dbuser123@cluster0.th0qwsg.mongodb.net/?retryWrites=true&w=majority";

async function processData() {
    let client;
    try {
        client = await MongoClient.connect(url);
        console.log("Connected to MongoDB");
        
        const db = client.db("Nodejs");
        const collection = db.collection('places');
        
        const data = fs.readFileSync('zips.csv', 'utf8');
        const lines = data.split('\n');
        const places = {};

        for (const line of lines) {
            if (line.trim() === '') continue;
            const [place, zip] = line.trim().split(',');
            if (!places[place]) {
                places[place] = [zip];
            } else {
                places[place].push(zip);
            }
        }

        for (const [place, zips] of Object.entries(places)) {
            const result = await collection.findOne({ place: place });
            if (result) {
                await collection.updateOne(
                    { place: place },
                    { $addToSet: { zips: { $each: zips } } }
                );
                console.log(`Updated: ${place} - ${zips}`);
            } else {
                await collection.insertOne({ place: place, zips: zips });
                console.log(`Added: ${place} - ${zips}`);
            }
        }

        console.log("Finished reading zips.csv");
    } catch (err) {
        console.log(err);
    } finally {
        if (client) {
            client.close();
        }
    }
}

processData();