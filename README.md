🚀 StockX: AI-Driven Stock Trading Web App
🔥 Project Overview
StockX is a modern full-stack web app that empowers users to track, analyze, and predict stock prices using real-time data and AI/ML techniques. It combines secure authentication, dynamic portfolio management, and advanced LSTM neural network predictions for smarter trading decisions.

💡 Key Features
🔐 User Authentication — Secure login/signup with JWT token-based authentication.

📈 Live Stock Data — Real-time updates from Finnhub API for accurate portfolio tracking.

📊 Portfolio & Transaction Dashboard — View your owned stocks, transaction history, and market prices with sleek animations.

🤖 AI-Powered Stock Price Prediction — LSTM neural network model forecasts future prices based on historical data from Alpha Vantage API.

🎨 Interactive UI/UX — Smooth animations and responsive design with React and Framer Motion.

🛠️ Technology Stack
Frontend: React.js, Framer Motion, Axios

Backend: Node.js, Express.js, MongoDB, JWT Authentication

AI/ML: Python, LSTM Model, Alpha Vantage & Finnhub APIs

Tools: Git, GitHub

📊 System Architecture
scss
Copy
Edit
🖥️ React Frontend
       ⇅
🛠️ Node.js Backend (API + Auth)
       ⇅
💾 MongoDB (User & Stock Data)
       ⇅
──────────────────────────────
     📈 Finnhub API (Live Stock Data)
     📉 Alpha Vantage API (Historical Data)
             ⇅
       🤖 LSTM Neural Network (Python)
             ⇅
       Prediction Results → Frontend
⚙️ How to Run Locally
1. Clone the repo
       git clone https://github.com/HimeshSaini03/STOCKX.git
       cd STOCKX
2. Setup Backend
       cd backend
       npm install
# Create a .env file with your MongoDB URI, JWT_SECRET, and API keys (Finnhub, Alpha Vantage)
       npm start
3. Setup Frontend
       Open a new terminal:
       cd frontend
       npm install
       npm start
The frontend will run at http://localhost:3000

4. Run AI/ML model (Python)
       Make sure you have Python and required packages installed:
       cd ml_model
       pip install -r requirements.txt
       python app.py
This script fetches historical data and trains the LSTM model for predictions.

+--------------------+      +--------------------+      +-------------------+
|                    |      |                    |      |                   |
|   React Frontend    | <--> |   Node.js Backend  | <--> |    MongoDB DB     |
|  (User Interface)   |      |  (API + Auth)      |      |  (User & Stock    |
|                    |      |                    |      |   Data Storage)   |
+--------------------+      +--------------------+      +-------------------+
          |                          |
          |                          |
          v                          v
+--------------------+      +---------------------+
|  Finnhub API (Live  |      |  Alpha Vantage API   |
|  Stock Data)        |      |  (Historical Data)   |
+--------------------+      +---------------------+
          |                          |
          |                          v
          |                 +---------------------+
          |                 | LSTM Neural Network  |
          |                 | (Python ML Model)    |
          |                 +---------------------+
          |                          |
          +--------------------------+
                       Prediction Results
                            (Back to Frontend)
