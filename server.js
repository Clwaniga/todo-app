// server.js - BACKEND SERVER

const express = require('express');     // Web framework for Node.js
const mongoose = require('mongoose');   // MongoDB object modeling tool
const cors = require('cors');          // Cross-Origin Resource Sharing
const path = require('path');          // File path utilities
const tasks = require('./routes/tasks'); // Import task routes
require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Create Express application

// MIDDLEWARE SETUP
app.use(cors());                    // Allow cross-origin requests
app.use(express.json());            // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// API ROUTES
app.use('/tasks', tasks); // All routes starting with '/tasks' go to tasks router

// SERVE THE MAIN HTML PAGE
app.get('/', (req, res) => {
    // When someone visits the root URL, send the HTML file
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
