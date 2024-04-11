const express = require('express'); 
const bodyParser = require('body-parser'); 
const mongodb = require('mongodb'); 
const path = require('path'); 
const nodemailer = require('nodemailer');

const app = express(); 
const PORT = 3000;

// MongoDB connection online atlas pe
const MongoClient = mongodb.MongoClient; 
const url = 'mongodb+srv://Hardik263:Hardik263@cluster0.gwxnipf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // MongoDB Atlas ka connection URL
const dbName = 'restaurant'; 
const collectionName = 'reservation'; 

// Nodemailer ka setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'motimahal116@gmail.com',
        pass: 'cvmwpoiifdalbzqw' 
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// index page ke lia
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

// thankyou page ke lia
app.get('/thankyou', (req, res) => {
    res.sendFile(path.join(__dirname, 'thank.html')); 
});

// newsletter page ke lia
app.get('/thankyou-newsletter', (req, res) => {
    res.sendFile(path.join(__dirname, 'newsletter.html')); 
});

// Reservation submission ko handle karna
app.post('/submit-reservation', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const reservationData = req.body;
        const result = await collection.insertOne(reservationData);

        // Reservation ke liye email notification bheja gaya hai
        await sendReservationEmailNotification(reservationData);

        client.close(); 
        res.redirect('/thankyou'); 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while submitting reservation' }); 
    }
});

// Newsletter subscription ko handle karna
app.post('/subscribe-newsletter', async (req, res) => {
    try {
        const { email_address } = req.body; 
        await sendNewsletterEmailNotification(email_address);
        res.redirect('/thankyou-newsletter'); 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while subscribing to newsletter' }); 
    }
});

// Reservation ke liye email notification bhejne ka function
async function sendReservationEmailNotification(reservationData) {
    try {
        const mailOptions = {
            from: 'motimahal116@gmail.com',
            to: reservationData.email_address,
            subject: 'Reservation Confirmation',
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

        await transporter.sendMail(mailOptions);
        console.log('Reservation email notification sent successfully'); 
    } catch (error) {
        console.error('Error sending reservation email notification:', error); 
    }
}

// Newsletter subscription ke liye email notification bhejne ka function
async function sendNewsletterEmailNotification(email_address) {
    try {
        const mailOptions = {
            from: 'motimahal116@gmail.com',
            to: email_address,
            subject: 'Newsletter Subscription Confirmation',
            text: `Hello,

            Thank you for subscribing to our newsletter! You will now receive updates, promotions, and special offers directly to your inbox.

            We appreciate your interest in our restaurant and look forward to sharing exciting news with you.

            Best Regards,
            Moti Mahal Team
            Hardik Malviya`
        };

        await transporter.sendMail(mailOptions); 
        console.log('Newsletter subscription email notification sent successfully'); 
    } catch (error) {
        console.error('Error sending newsletter subscription email notification:', error); 
    }
}

// Server ko start kiya gaya hai
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); 
});
