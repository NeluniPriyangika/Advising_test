const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this to your server.js before your routes
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  
  serverSelectionTimeoutMS: 50000,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


// Import routes
const authRoutes = require('./routes/auth');
const fbAuthRoutes = require('./routes/fb-auth');
const profileUpdateRoutes = require('./routes/profileupdate');
const seekerProfileUpdateRoutes = require('./routes/seekerprofileupdate');
const chatRoutes = require('./routes/chatRoutes');

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', fbAuthRoutes); // Add this line for Facebook auth
app.use('/api', profileUpdateRoutes);
app.use('/api', seekerProfileUpdateRoutes);
app.use('/chat', chatRoutes);

// Error handling middleware (add this after your routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!'
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));