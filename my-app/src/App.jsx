import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/auth/PrivateRoute'
import HomePage from './pages/HomePage'

function App() {
  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </div>
      </div>
  )
}

export default App
//<Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />