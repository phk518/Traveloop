export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  preferences?: Record<string, any>;
}

export interface Activity {
  id?: string;
  _id?: string;
  name: string;
  cost: number;
  type: string;
  duration?: string;
  description?: string;
}

export interface Stop {
  id?: string;
  _id?: string;
  city_name: string;
  arrival_date: string;
  departure_date: string;
  activities: Activity[];
}

export interface PackingItem {
  id?: string;
  _id?: string;
  item: string;
  category: string;
  is_packed: boolean;
}

export interface JournalNote {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  tags?: string;
  created_at?: string;
}

export interface Trip {
  id: string;
  _id?: string;
  userId: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  cover_photo: string;
  is_public: boolean;
  stops: Stop[];
  packing_list: PackingItem[];
  notes: JournalNote[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DataContextType {
  user: User | null;
  trips: Trip[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  createTrip: (tripData: Partial<Trip>) => Promise<Trip>;
  updateTrip: (tripId: string, tripData: Partial<Trip>) => Promise<Trip>;
  cloneTrip: (tripId: string) => Promise<Trip>;
  addStop: (tripId: string, stopData: Partial<Stop>) => Promise<Stop>;
  deleteStop: (stopId: string) => Promise<void>;
  addActivity: (stopId: string, activityData: Partial<Activity>) => Promise<Activity>;
  deleteActivity: (activityId: string) => Promise<void>;
  addPackingItem: (tripId: string, item: string, category: string) => Promise<PackingItem>;
  togglePackingItem: (itemId: string, isPacked: boolean) => Promise<void>;
  addJournalEntry: (tripId: string, entryData: Partial<JournalNote>) => Promise<JournalNote>;
  deleteJournalEntry: (noteId: string) => Promise<void>;
}
