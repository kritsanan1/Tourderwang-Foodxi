
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import RestaurantListings from './pages/RestaurantListings'
import RestaurantMenu from './pages/RestaurantMenu'
import OrderTracking from './pages/OrderTracking'
import UserProfile from './pages/UserProfile'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantListings />} />
            <Route path="/restaurant/:id" element={<RestaurantMenu />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
