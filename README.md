# shamba-smart
🌱 ShambaSmart – AI-Powered Agriculture Platform for Kenya
📘 Overview

ShambaSmart is Kenya’s first platform for sustainable agriculture.
It leverages modern technology and the MERN stack (MongoDB, Express.js, React.js, Node.js) to transform how farmers, agronomists, and agricultural institutions access real-time insights about soil health, crop recommendations, and climate predictions.

The goal is to maximize yields, improve environmental sustainability, and empower Kenyan farmers through technology.

🌍 Core Features

Experts' Soil Analysis – Analyze soil nutrient content and health in real time.

Crop Recommendations – Expertise'-driven suggestions based on soil data, local weather, and market demand.

Climate Insights – Real-time weather data and predictive analytics from Kenya Meteorological Department APIs.

County & Sub-County Mapping – Supports all 47 counties, their sub-counties, constituencies, and locations for localized insights.

Yield Prediction – Machine learning models forecast yield based on historical and live data.

Farm Analytics Dashboard – Interactive charts to track performance, sustainability, and profit metrics.

Multilingual Interface – English, Swahili, and French support.

Responsive Design – Works seamlessly across desktop and mobile devices.

ML Models:

Soil Nutrient Prediction Model

Crop Recommendation Engine

Weather Pattern Prediction Model

Yield Estimation Model

Data Sources:

Kenya Meteorological Department (KMD) API

NASA POWER API for climate and solar data

Kenya Soil Survey datasets

FAO & OpenAgriData repositories

🧩 Tech Stack
Layer	Technology
Frontend	React.js, Tailwind CSS, Axios, Chart.js, React Router
Backend	Node.js, Express.js, RESTful APIs
Database	MongoDB (Atlas or local), Mongoose ORM
AI Layer	TensorFlow.js / Flask API for ML models
Authentication	JWT (JSON Web Tokens), bcrypt.js
Cloud Services	AWS / Vercel / Render
Version Control	Git + GitHub
DevOps	Docker (optional), GitHub Actions for CI/CD
📁 Project Structure
ShambaSmart/
│
├── frontend/                # React app (Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── backend/                 # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│
│
├── .env.example             # Sample environment variables
├── .gitignore
├── README.md
└── vercel.json

⚙️ Environment Setup
1️⃣ Prerequisites

Ensure the following are installed:

Node.js
 (v20 or higher)

MongoDB
 or MongoDB Atlas account


Git

Code editor (VS Code recommended)

2️⃣ Clone Repository
git clone https://github.com/your-username/shambasmart.git
cd shambasmart

3️⃣ Setup Backend
cd backend
npm install
npm run dev


Create .env in backend/ with:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret


4️⃣ Setup Frontend
cd frontend
npm install
npm run dev


Create .env in frontend/:

VITE_API_BASE_URL=http://localhost:5000


🚀 Deployment Options
Platform	Description
Vercel	Best for frontend React hosting
Render	Perfect for Node.js & Express backend
Railway.app / Cyclic.sh	Alternative free Node hosting
MongoDB Atlas	Cloud-hosted database
AWS EC2 / Lightsail	Full-stack scalable deployment
Docker + GitHub Actions	For containerized CI/CD setup
🧱 Deployment Steps
Frontend (Vercel)

Push frontend to GitHub

Connect GitHub repo to Vercel

Set environment variable VITE_API_BASE_URL to backend URL

Deploy

Backend (Render)

Push backend to GitHub

Connect GitHub repo to Render

Set environment variables from .env

Deploy


Deploy Flask app on Render / AWS EC2 / Hugging Face Spaces

Expose endpoint (e.g. https://ai.shambasmart.co.ke/analyze)

📊 Future Enhancements

AI enhanced analysis

Integration with IoT soil sensors

Mobile App (React Native) version

AI chat assistant for farmers using LLM fine-tuning

Government and NGO integration dashboards

👨🏽‍💻 Authors

Stephen Muchanga

stephenmuchanga@gmail.com 

📧 info@shambasmart.co.ke

🌍 Nairobi, Kenya


# Deliverables
1. Link to the deployed application
https://shamba-smart-five.vercel.app/
2. Link to a 5-10 minute video demonstration
Coming soon...
3. Screenshots of key features
[Images](screenshots/)