const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;//port describe kara

// mongodb connect kara
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'restaurant';
const collectionName = 'reservations';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// css or images connect kara
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// html connect kara
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// db mai data dalne ke lia
app.post('/submit-reservation', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const reservationData = req.body;
        const result = await collection.insertOne(reservationData);

        client.close();
        res.status(200).json({ message: 'Reservation submitted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while submitting reservation' });
    }
});
// web server banaya
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);//web server start kara PORT per 
});
