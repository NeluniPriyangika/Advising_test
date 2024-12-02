const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Initialize Socket.IO with CORS options
const io = socketIo(server, {
  cors: corsOptions
});

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

// Store io instance on app
app.set('io', io);

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

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (advisorSessionId) => {
    socket.join(advisorSessionId);
  });
  
  socket.on('message', async (data) => {
    try {
      const { advisorSessionId, advisorMessage } = data;
      io.to(advisorSessionId).emit('message', advisorMessage);
    } catch (error) {
      console.error('Socket error:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const fbAuthRoutes = require('./routes/fb-auth');
const profileUpdateRoutes = require('./routes/profileupdate');
const seekerProfileUpdateRoutes = require('./routes/seekerprofileupdate');
const chatRoutes = require('./routes/chatRoutes');
const advisorChatRoutes = require('./routes/adviorChatRoute');
const advisorProfileRoutes = require('./routes/advisorprofile');

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', fbAuthRoutes);
app.use('/api', profileUpdateRoutes);
app.use('/api', seekerProfileUpdateRoutes);
app.use('/chat', chatRoutes);
app.use('/advisor-chat', advisorChatRoutes);
app.use('/api', advisorProfileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));