
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const reviews_data = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8')
);

const dealerships_data = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'dealerships.json'), 'utf8')
);

const Reviews = require('./review');
const Dealerships = require('./dealership');

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/dealershipsDB")
    .then(async () => {
        console.log("MongoDB connected successfully");

        try {
            await Reviews.deleteMany({});
            await Reviews.insertMany(reviews_data['reviews']);

            await Dealerships.deleteMany({});
            await Dealerships.insertMany(dealerships_data['dealerships']);

            console.log("Database seeded successfully");
        } catch (error) {
            console.error("Database seeding error:", error);
        }
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Home route
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
    try {
        const documents = await Reviews.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Fetch reviews by dealership
app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const documents = await Reviews.find({
            dealership: req.params.id
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
        const documents = await Dealerships.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships' });
    }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const documents = await Dealerships.find({
            state: req.params.state
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships' });
    }
});

// Fetch dealership by ID
app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const documents = await Dealerships.find({
            id: Number(req.params.id)
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealership' });
    }
});

// Insert review with sentiment
app.post('/insert_review', async (req, res) => {
    try {
        const data = req.body;

        const documents = await Reviews.find().sort({ id: -1 });
        const new_id = documents.length > 0 ? documents[0].id + 1 : 1;

        const review = new Reviews({
            id: new_id,
            name: data.name,
            dealership: data.dealership,
            review: data.review,
            sentiment: data.sentiment,
            purchase: data.purchase,
            purchase_date: data.purchase_date,
            car_make: data.car_make,
            car_model: data.car_model,
            car_year: data.car_year
        });

        const savedReview = await review.save();
        res.json(savedReview);

    } catch (error) {
        console.error("Review insertion error:", error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
