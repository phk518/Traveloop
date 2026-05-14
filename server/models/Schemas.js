const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  preferences: { type: Object, default: {} }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const TripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  start_date: String,
  end_date: String,
  description: String,
  cover_photo: String,
  is_public: { type: Boolean, default: false },
  stops: [{
    city_name: String,
    arrival_date: String,
    departure_date: String,
    activities: [{
      name: String,
      cost: Number,
      type: String,
      duration: String,
      description: String
    }]
  }],
  packing_list: [{
    item: String,
    category: String,
    is_packed: { type: Boolean, default: false }
  }],
  notes: [{
    title: String,
    content: String,
    tags: String,
    created_at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Transform _id to id for frontend compatibility
const transform = (doc, ret) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

UserSchema.set('toJSON', { transform });
TripSchema.set('toJSON', { transform });

const User = mongoose.model('User', UserSchema);
const Trip = mongoose.model('Trip', TripSchema);

module.exports = { User, Trip };
