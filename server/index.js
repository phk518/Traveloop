const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { User, Trip } = require('./models/Schemas');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Traveloop MongoDB API is running');
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = new User({ email, password, name });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trip Routes
app.get('/api/trips', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const trips = await Trip.find({ userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips', async (req, res) => {
  try {
    const { userId, name, start_date, end_date, description, cover_photo } = req.body;
    const trip = new Trip({ userId, name, start_date, end_date, description, cover_photo });
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips/:id/clone', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required to clone' });
    
    const originalTrip = await Trip.findById(req.params.id);
    if (!originalTrip) return res.status(404).json({ error: 'Original trip not found' });
    
    // Create a deep copy of the trip document
    const clonedTripData = originalTrip.toObject();
    delete clonedTripData._id;
    delete clonedTripData.id;
    delete clonedTripData.createdAt;
    delete clonedTripData.updatedAt;
    
    // Assign to new user and append " (Copy)" to the name
    clonedTripData.userId = userId;
    clonedTripData.name = `${clonedTripData.name} (Copy)`;
    
    // Mongoose will generate new ObjectIds for the trip and all nested subdocuments upon save
    const clonedTrip = new Trip(clonedTripData);
    await clonedTrip.save();
    
    res.json(clonedTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:id/full', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop Routes
app.post('/api/trips/:id/stops', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    const newStop = { ...req.body };
    trip.stops.push(newStop);
    await trip.save();
    
    // Return the newly created stop (it will have an _id)
    const savedStop = trip.stops[trip.stops.length - 1];
    res.json(savedStop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stops/:id', async (req, res) => {
  try {
    // In our nested structure, we need to find the trip that contains this stop
    const trip = await Trip.findOne({ "stops._id": req.params.id });
    if (!trip) return res.status(404).json({ error: 'Stop not found' });
    
    trip.stops = trip.stops.filter(s => s._id.toString() !== req.params.id);
    await trip.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activity Routes
app.post('/api/stops/:id/activities', async (req, res) => {
  try {
    const trip = await Trip.findOne({ "stops._id": req.params.id });
    if (!trip) return res.status(404).json({ error: 'Stop not found' });
    
    const stop = trip.stops.id(req.params.id);
    stop.activities.push(req.body);
    await trip.save();
    
    const savedActivity = stop.activities[stop.activities.length - 1];
    res.json(savedActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/activities/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({ "stops.activities._id": req.params.id });
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
app.post('/api/trips/:id/packing', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    trip.packing_list.push(req.body);
    await trip.save();
    res.json(trip.packing_list[trip.packing_list.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/packing/:itemId', async (req, res) => {
  try {
    const trip = await Trip.findOne({ "packing_list._id": req.params.itemId });
    const item = trip.packing_list.id(req.params.itemId);
    item.is_packed = req.body.is_packed;
    await trip.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Journal Routes
app.post('/api/trips/:id/notes', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    trip.notes.push(req.body);
    await trip.save();
    res.json(trip.notes[trip.notes.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notes/:noteId', async (req, res) => {
  try {
    const trip = await Trip.findOne({ "notes._id": req.params.noteId });
    trip.notes = trip.notes.filter(n => n._id.toString() !== req.params.noteId);
    await trip.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with MongoDB`);
});
