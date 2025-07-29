import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Market from './pages/Market';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Footer from './components/Footer';
import { isLoggedIn } from './utils/auth';

// A layout component to handle conditional rendering of the Footer
const AppLayout = () => {
    const location = useLocation(); // Get the current route

    return (
        <div className="app-container">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/market" element={<Market />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/prediction" element={<Prediction />} />
            </Routes>
            {/* Conditionally render Footer only on the Home page */}
            {location.pathname === '/' && <Footer />}
        </div>
    );
};

const ProtectedRoute = ({ children }) => {
    return isLoggedIn() ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}

export default App;