const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb'); //database ke lia 
const path = require('path');
const nodemailer = require('nodemailer'); // email ke lia 

const app = express();
const PORT = 3000;

// MongoDB connection
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://chetan:Hardik126@cluster0.gwxnipf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'restaurant';
const collectionName = 'reservation';

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'moviefinder109@gmail.com',
        pass: 'qhvkhwrplsyoeogk'
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static assets (css, images, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle reservation submission
app.post('/submit-reservation', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const reservationData = req.body;
        const result = await collection.insertOne(reservationData);

        // Send email notification
        await sendEmailNotification(reservationData);

        client.close();
        // Redirect to thank you page
        res.redirect('/thankyou');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while submitting reservation' });
    }
});

// Serve thank you page
app.get('/thankyou', (req, res) => {
    res.sendFile(path.join(__dirname, 'thank.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Function to send email notification
async function sendEmailNotification(reservationData) {
    try {
        // Email content
        const mailOptions = {
            from: 'moviefinder109@gmail.com', // Sender address
            to: reservationData.email_address, // reservation email (reciver ke lia)
            subject: 'Reservation Confirmation', // Email subject
            text: `Hello ${reservationData.name},

            Thank you for making a reservation with us. We are delighted to confirm your booking. Below are the details of your reservation:
            
            Name: ${reservationData.name}
            Phone Number: ${reservationData.phone}
            Number of Persons: ${reservationData.person}
            Reservation Date: ${reservationData.reservationDate}
            Reservation Time: ${reservationData.time}
            
            Your presence is highly appreciated, and we can't wait to serve you with our finest dishes and excellent service.
            
            If you have any special requests or need to modify your reservation, feel free to contact us. We're here to ensure you have a wonderful dining experience.
            
            Looking forward to welcoming you to our restaurant!
            
            Best Regards,
            Moti Mahal Team
            Hardik Malviya`
                    };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
}
