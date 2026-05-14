# 🌌 Traveloop: Personalized Travel Planning Made Easy

**Traveloop** is a modern, high-fidelity travel planning platform designed to transform the way individuals dream, design, and organize their journeys. Built with a "Cosmic Dark" aesthetic and a Bento Grid design system, it provides an immersive end-to-end experience for multi-city travel.

---

## 🚀 Vision & Mission
The overarching vision for Traveloop is to become a personalized, intelligent, and collaborative platform. We aim to empower users to visualize their journeys through structured itineraries, make cost-effective decisions, and maintain a digital legacy of their travels—making travel planning as exciting as the trip itself.

## ✨ Key Features

### 🗺️ Itinerary Management
- **Visual Timeline**: A vertical "Vertical Timeline" with glow-line aesthetics showing your journey from start to finish.
- **Activity Discovery**: Search and add curated activities to each city stop.
- **Meteorological Outlook**: Integrated **Open-Meteo API** provides live weather forecasts for every city in your itinerary.

### 💰 Budget & Analytics
- **Interactive Charts**: Professional data visualization using **Chart.js** (Doughnut & Bar charts).
- **Multi-Currency Support**: Real-time currency conversion (USD, EUR, GBP, CNY, JPY) powered by the **Frankfurter API**.
- **Critical Alerts**: Automated budget monitoring that flags over-spending in specific categories.

### 📓 Digital Legacy
- **Trip Journal**: Document your experiences with a localized journal module.
- **Packing List**: Smart checklists to ensure you never leave a cosmic essential behind.
- **Sharing**: One-click public link sharing for your travel manifests.

### 🛡️ Command Center (Admin)
- **Global Analytics**: Real-time platform metrics including user growth and trip creation trends.
- **Engagement Tracking**: Interactive line charts monitoring "Cosmic Voyager" activity.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Charts** | Chart.js, React-Chartjs-2 |
| **API** | Open-Meteo (Weather), Frankfurter (Currency) |
| **Testing** | Playwright (Smoke Tests) |

---

## 🎨 Design Philosophy: "Cosmic Dark"
Traveloop utilizes a custom design system characterized by:
- **Glassmorphism**: Semi-transparent panels with backdrop-blur for a premium feel.
- **Bento Grids**: Logical, responsive organization of information.
- **Dynamic Micro-animations**: Subtle transitions and hover effects that make the interface feel alive.
- **High-Fidelity Assets**: No AI placeholders; utilizes professional photography from Unsplash.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://localhost:27017/`)

### Setup Instructions

1. **Clone the Manifest**:
   ```bash
   git clone https://github.com/phk518/Traveloop.git
   cd Traveloop
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch the Core (Backend)**:
   ```bash
   cd server
   node server.js
   ```

4. **Ignite the Frontend**:
   ```bash
   # In the root directory
   npm run dev
   ```

---

## 📡 API Integrations
- **Weather**: Fetches live data via `api.open-meteo.com` (Zero-config).
- **Currency**: Real-time exchange rates via `api.frankfurter.app`.
- **Images**: Dynamic destination covers sourced from **Unsplash**.

---

## 📜 License
Built for the **OODO-HACKATHON**. Distributed under the MIT License.

---

*Designed with 💜 by the Traveloop Team.*
