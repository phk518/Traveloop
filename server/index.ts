import mojo, { MojoContext } from '@mojojs/core';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, Trip } from './models/Schemas';

dotenv.config();

const app = mojo();
const PORT = parseInt(process.env.PORT || '3001');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/traveloop';
const JWT_SECRET = process.env.JWT_SECRET || 'cosmic-traveloop-secret-2026';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB via mojo.js'))
  .catch(err => console.error('MongoDB connection error:', err));

// CORS Hook
app.addHook('beforeDispatch', async (ctx) => {
  ctx.res.set('Access-Control-Allow-Origin', '*');
  ctx.res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  ctx.res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (ctx.req.method === 'OPTIONS') {
    await ctx.render({ text: '', status: 204 });
    return true;
  }
});

// Auth Helper
app.addHelper('authenticate', async (ctx: MojoContext) => {
  const authHeader = ctx.req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    await ctx.render({ json: { error: 'Access denied' }, status: 401 });
    return null;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: string; isAdmin: boolean };
    return user;
  } catch (err) {
    await ctx.render({ json: { error: 'Invalid token' }, status: 403 });
    return null;
  }
});

// Routes
const api = app.any('/api').to({ controller: 'api' });

// Auth
app.post('/api/auth/register').to(async (ctx) => {
  const { email, password, name } = await ctx.req.json();
  const existing = await User.findOne({ email });
  if (existing) return ctx.render({ json: { error: 'Email already registered' }, status: 400 });
  
  const user = new User({ email, password, name });
  await user.save();
  
  const token = jwt.sign({ id: user._id.toString(), isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
  await ctx.render({ json: { user, token } });
});

app.post('/api/auth/login').to(async (ctx) => {
  const { email, password } = await ctx.req.json();
  const user = await User.findOne({ email });
  if (!user) return ctx.render({ json: { error: 'Invalid credentials' }, status: 401 });
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return ctx.render({ json: { error: 'Invalid credentials' }, status: 401 });
  
  const token = jwt.sign({ id: user._id.toString(), isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
  await ctx.render({ json: { user, token } });
});

// Trips
app.get('/api/trips').to(async (ctx) => {
  const authUser = await ctx.authenticate();
  if (!authUser) return;
  
  const trips = await Trip.find({ userId: authUser.id });
  await ctx.render({ json: trips });
});

app.post('/api/trips').to(async (ctx) => {
  const authUser = await ctx.authenticate();
  if (!authUser) return;
  
  const body = await ctx.req.json();
  const trip = new Trip({ ...body, userId: authUser.id });
  await trip.save();
  await ctx.render({ json: trip });
});

app.put('/api/trips/:id').to(async (ctx) => {
  const authUser = await ctx.authenticate();
  if (!authUser) return;
  
  const trip = await Trip.findOne({ _id: ctx.stash.id, userId: authUser.id });
  if (!trip) return ctx.render({ json: { error: 'Trip not found' }, status: 404 });
  
  Object.assign(trip, await ctx.req.json());
  await trip.save();
  await ctx.render({ json: trip });
});

app.get('/api/trips/:id/full').to(async (ctx) => {
  const authUser = await ctx.authenticate();
  if (!authUser) return;
  
  const trip = await Trip.findOne({ _id: ctx.stash.id, userId: authUser.id });
  if (!trip) return ctx.render({ json: { error: 'Trip not found' }, status: 404 });
  await ctx.render({ json: trip });
});

app.post('/api/trips/:id/clone').to(async (ctx) => {
  const authUser = await ctx.authenticate();
  if (!authUser) return;
  
  const originalTrip = await Trip.findById(ctx.stash.id);
  if (!originalTrip) return ctx.render({ json: { error: 'Original trip not found' }, status: 404 });
  
  const clonedTripData = originalTrip.toObject();
  delete clonedTripData._id;
  delete (clonedTripData as any).id;
  delete (clonedTripData as any).createdAt;
  delete (clonedTripData as any).updatedAt;
  
  clonedTripData.userId = authUser.id;
  clonedTripData.name = `${clonedTripData.name} (Copy)`;
  
  const clonedTrip = new Trip(clonedTripData);
  await clonedTrip.save();
  await ctx.render({ json: clonedTrip });
});

// Stops & Activities
app.post('/api/trips/:id/stops').to(async (ctx) => {
  const authUser = await ctx.authenticate();
  if (!authUser) return;
  
  const trip = await Trip.findOne({ _id: ctx.stash.id, userId: authUser.id });
  if (!trip) return ctx.render({ json: { error: 'Trip not found' }, status: 404 });
  
  const body = await ctx.req.json();
  trip.stops.push(body);
  await trip.save();
  await ctx.render({ json: trip.stops[trip.stops.length - 1] });
});

app.delete('/api/stops/:id').to(async (ctx) => {
  const authUser = await ctx.authenticate();
  if (!authUser) return;
  
  const trip = await Trip.findOne({ "stops._id": ctx.stash.id, userId: authUser.id });
  if (!trip) return ctx.render({ json: { error: 'Stop not found' }, status: 404 });
  
  trip.stops = trip.stops.filter((s: any) => s._id.toString() !== ctx.stash.id);
  await trip.save();
  await ctx.render({ json: { success: true } });
});

app.post('/api/stops/:id/activities').to(async (ctx) => {
  const authUser = await ctx.authenticate();
  if (!authUser) return;
  
  const trip = await Trip.findOne({ "stops._id": ctx.stash.id, userId: authUser.id });
  if (!trip) return ctx.render({ json: { error: 'Stop not found' }, status: 404 });
  
  const stop = (trip.stops as any).id(ctx.stash.id);
  const body = await ctx.req.json();
  stop.activities.push(body);
  await trip.save();
  await ctx.render({ json: stop.activities[stop.activities.length - 1] });
});

// Admin
app.get('/api/admin/stats').to(async (ctx) => {
  const authUser = await ctx.authenticate();
  if (!authUser || !authUser.isAdmin) return ctx.render({ json: { error: 'Admin access required' }, status: 403 });
  
  const totalUsers = await User.countDocuments();
  const totalTrips = await Trip.countDocuments();
  await ctx.render({ json: { totalUsers, totalTrips } });
});

app.start();
