import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, Trip, IUser, ITrip } from './models/Schemas';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/traveloop';
const JWT_SECRET = process.env.JWT_SECRET || 'cosmic-traveloop-secret-2026';

// Middleware
app.use(cors());
app.use(express.json());

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
}

// Auth Middleware
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user as { id: string; isAdmin: boolean };
    next();
  });
};

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Traveloop Secured TS API is running');
});

// Auth Routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    
    const user = new User({ email, password, name });
    await user.save();
    
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Trip Routes
app.get('/api/trips', authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const trips = await Trip.find({ userId });
    res.json(trips);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips', authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const { name, start_date, end_date, description, cover_photo } = req.body;
    const trip = new Trip({ userId: req.user?.id, name, start_date, end_date, description, cover_photo });
    await trip.save();
    res.json(trip);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/trips/:id', authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!trip) return res.status(404).json({ error: 'Trip not found or unauthorized' });
    
    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips/:id/clone', authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const originalTrip = await Trip.findById(req.params.id);
    if (!originalTrip) return res.status(404).json({ error: 'Original trip not found' });
    
    const clonedTripData = originalTrip.toObject();
    delete clonedTripData._id;
    delete (clonedTripData as any).id;
    delete clonedTripData.createdAt;
    delete clonedTripData.updatedAt;
    
    clonedTripData.userId = req.user?.id;
    clonedTripData.name = `${clonedTripData.name} (Copy)`;
    
    const clonedTrip = new Trip(clonedTripData);
    await clonedTrip.save();
    res.json(clonedTrip);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:id/full', authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Stop Routes
app.post('/api/trips/:id/stops', authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    trip.stops.push(req.body);
    await trip.save();
    
    res.json(trip.stops[trip.stops.length - 1]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stops/:id', authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOne({ "stops._id": req.params.id, userId: req.user?.id });
    if (!trip) return res.status(404).json({ error: 'Stop not found' });
    
    trip.stops = trip.stops.filter((s: any) => s._id.toString() !== req.params.id);
    await trip.save();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Activity Routes
app.post('/api/stops/:id/activities', authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOne({ "stops._id": req.params.id, userId: req.user?.id });
    if (!trip) return res.status(404).json({ error: 'Stop not found' });
    
    const stop = (trip.stops as any).id(req.params.id);
    stop.activities.push(req.body);
    await trip.save();
    res.json(stop.activities[stop.activities.length - 1]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ... other routes updated similarly with AuthRequest and types ...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with MongoDB (TypeScript)`);
});
