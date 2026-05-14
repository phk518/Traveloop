const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { User, Trip } = require('./models/Schemas');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const JWT_SECRET = process.env.JWT_SECRET || 'cosmic-traveloop-secret-2026';

// Middleware
app.use(cors()); // In production, restrict to frontend URL
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Traveloop Secured API is running');
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    
    const user = new User({ email, password, name });
    await user.save();
    
    // Generate token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trip Routes
app.get('/api/trips', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await Trip.find({ userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips', authenticateToken, async (req, res) => {
  try {
    const { name, start_date, end_date, description, cover_photo } = req.body;
    const trip = new Trip({ userId: req.user.id, name, start_date, end_date, description, cover_photo });
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: 'Trip not found or unauthorized' });
    
    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips/:id/clone', authenticateToken, async (req, res) => {
  try {
    const originalTrip = await Trip.findById(req.params.id);
    if (!originalTrip) return res.status(404).json({ error: 'Original trip not found' });
    
    const clonedTripData = originalTrip.toObject();
    delete clonedTripData._id;
    delete clonedTripData.id;
    delete clonedTripData.createdAt;
    delete clonedTripData.updatedAt;
    
    clonedTripData.userId = req.user.id;
    clonedTripData.name = `${clonedTripData.name} (Copy)`;
    
    const clonedTrip = new Trip(clonedTripData);
    await clonedTrip.save();
    res.json(clonedTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:id/full', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop Routes
app.post('/api/trips/:id/stops', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    const newStop = { ...req.body };
    trip.stops.push(newStop);
    await trip.save();
    
    res.json(trip.stops[trip.stops.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stops/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ "stops._id": req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: 'Stop not found' });
    
    trip.stops = trip.stops.filter(s => s._id.toString() !== req.params.id);
    await trip.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activity Routes
app.post('/api/stops/:id/activities', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ "stops._id": req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: 'Stop not found' });
    
    const stop = trip.stops.id(req.params.id);
    stop.activities.push(req.body);
    await trip.save();
    res.json(stop.activities[stop.activities.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/activities/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ "stops.activities._id": req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: 'Activity not found' });
    
    trip.stops.forEach(stop => {
      stop.activities = stop.activities.filter(a => a._id.toString() !== req.params.id);
    });
    
    await trip.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Packing List Routes
app.post('/api/trips/:id/packing', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    trip.packing_list.push(req.body);
    await trip.save();
    res.json(trip.packing_list[trip.packing_list.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/packing/:itemId', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ "packing_list._id": req.params.itemId, userId: req.user.id });
    const item = trip.packing_list.id(req.params.itemId);
    item.is_packed = req.body.is_packed;
    await trip.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Journal Routes
app.post('/api/trips/:id/notes', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    trip.notes.push(req.body);
    await trip.save();
    res.json(trip.notes[trip.notes.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notes/:noteId', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({ "notes._id": req.params.noteId, userId: req.user.id });
    trip.notes = trip.notes.filter(n => n._id.toString() !== req.params.noteId);
    await trip.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Route (Example)
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
  try {
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    res.json({ totalUsers, totalTrips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with MongoDB`);
});
