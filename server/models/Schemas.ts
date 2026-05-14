import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  preferences: Record<string, any>;
}

export interface IActivity {
  name: string;
  cost: number;
  type: string;
  duration?: string;
  description?: string;
}

export interface IStop {
  _id: mongoose.Types.ObjectId;
  city_name: string;
  arrival_date: string;
  departure_date: string;
  activities: IActivity[];
}

export interface IPackingItem {
  _id: mongoose.Types.ObjectId;
  item: string;
  category: string;
  is_packed: boolean;
}

export interface INote {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags?: string;
  created_at: Date;
}

export interface ITrip extends Document {
  userId: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  cover_photo: string;
  is_public: boolean;
  stops: IStop[];
  packing_list: IPackingItem[];
  notes: INote[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  preferences: { type: Object, default: {} }
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

const TripSchema: Schema = new Schema({
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
const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

UserSchema.set('toJSON', { transform });
TripSchema.set('toJSON', { transform });

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export const Trip: Model<ITrip> = mongoose.model<ITrip>('Trip', TripSchema);
