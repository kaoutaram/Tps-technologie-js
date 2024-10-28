
// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/readingTracker')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define book model
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    pages: Number,
    status: {
        type: String,
        enum: ['Read', 'Re-read', 'DNF', 'Currently reading', 'Returned Unread', 'Want to read'],
    },
    price: Number,
    pagesRead: Number,
    finished: {
        type: Number,
        default: 0,
    },
    format: {
        type: String,
        enum: ['Print', 'PDF', 'Ebook', 'AudioBook'],
    },
    suggestedBy: String,
});

// Update the "finished" field based on "pagesRead"
bookSchema.pre('save', function(next) {
    this.finished = this.pagesRead >= this.pages ? 1 : 0;
    next();
});

const Book = mongoose.model('Book', bookSchema);

// API Routes
app.post('/api/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error adding a book:', error);
        res.status(500).json({ error: 'Error adding the book' });
    }
});

app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error('Error retrieving books:', error);
        res.status(500).json({ error: 'Error retrieving books' });
    }
});

// Serve the HTML file at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Update the path to your HTML file
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
