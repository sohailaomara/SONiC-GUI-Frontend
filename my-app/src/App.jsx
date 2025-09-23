import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/auth/PrivateRoute";
import HomePage from "./pages/HomePage";
import Vlanpage from "./pages/Vlanpage";
import PortOps from "./pages/PortOps";

function App() {
  return (
    <Routes>
      {/* Centered Login */}
      <Route
        path="/login"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md px-4">
              <Login />
            </div>
          </div>
        }
      />

      {/* Centered Register */}
      <Route
        path="/register"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md px-4">
              <Register />
            </div>
          </div>
        }
      />

      {/* Redirect root to register */}
      <Route path="/" element={<Navigate to="/register" />} />

      {/* Full-Width Dashboard Home */}
      <Route
        path="/home"
        element={
          // <PrivateRoute>
          <HomePage />
          //</PrivateRoute>
        }
      />
      <Route path="/vlan" element={<Vlanpage />} />
      <Route path="/portops" element={<PortOps />} />
    </Routes>
  );
}

export default App;
