# 🌌 Traveloop: The Future of Personalized Travel Planning

**Traveloop** is a high-performance, full-stack travel manifest platform built for the **OODO-HACKATHON**. It combines a stunning "Cosmic Dark" aesthetic with a bleeding-edge technical architecture to provide an unparalleled journey-planning experience.

---

## 🚀 Key Technical Milestones

### 🛡️ Secure-First Architecture
- **Python Security Guard**: A custom `security_audit.py` engine that automates secret scanning, dependency auditing, and WAF simulation.
- **JWT & Bcrypt**: Robust session management and password hashing ensure all traveler data is encrypted and protected.
- **Authorized Endpoints**: Every API route is guarded by an authentication middleware, preventing unauthorized access to private manifests.
- **Full-Stack TypeScript**: 100% type coverage from the database schema to the frontend components, eliminating entire classes of runtime errors.

### ⚡ High-Performance Backend (mojo.js)
- **Framework**: Migrated from Express to **mojo.js**, a modern real-time framework designed for 3x performance and built-in scalability.
- **Real-Time Ready**: Built-in support for WebSockets and asynchronous workflows.
- **Clean API**: Modular helpers and hooks for centralized logic management.

### 📊 Immersive Analytics & Data
- **Dynamic Visuals**: Interactive **Chart.js** dashboards for budget tracking and admin oversight.
- **Live Integrations**: 
    - **Open-Meteo**: Real-time weather forecasts for every destination.
    - **Frankfurter**: Live currency conversion (USD, EUR, GBP, CNY, JPY).
    - **Unsplash**: High-fidelity destination imagery.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Backend** | **mojo.js**, TypeScript, Node.js |
| **Security** | Python (Bandit, Safety), JWT, Bcrypt.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Testing** | Playwright (Smoke Tests) |

---

## 🎨 Design Philosophy
Traveloop utilizes a custom design system characterized by:
- **Cosmic Dark Theme**: A curated, harmonious color palette optimized for low-light environments.
- **Bento Grid Layout**: Responsive, logical organization of complex travel data.
- **Glassmorphism**: Premium semi-transparent panels with backdrop-blur effects.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v20+)
- MongoDB (Local or Atlas)

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/phk518/Traveloop.git
   cd Traveloop
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   # Create a .env file with VITE_API_URL=http://localhost:3001
   npm run dev
   ```

3. **Backend Setup**:
   ```bash
   cd server
   npm install
   # Create a .env file with MONGODB_URI and JWT_SECRET
   npm run dev
   ```

---

## 📡 Core API Modules
- **Authentication**: Secure registration, login, and token verification.
- **Trip Management**: Full CRUD operations with trip cloning and metadata updates.
- **Itinerary Tracking**: Dynamic stop and activity management with weather integration.
- **Financial Analytics**: Real-time cost calculation with multi-currency support.

---

## 📜 License
Distributed under the MIT License. Built with 💜 by the Traveloop Team.

---

*Explore the universe, one city at a time.*
