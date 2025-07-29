
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Tourderwang</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/restaurants" className="text-gray-600 hover:text-primary-500 transition-colors">
              ร้านอาหาร
            </Link>
            <Link to="/order-tracking" className="text-gray-600 hover:text-primary-500 transition-colors">
              ติดตามออเดอร์
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-primary-500 transition-colors">
              โปรไฟล์
            </Link>
            <Link to="/login" className="btn-primary">
              เข้าสู่ระบบ
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="mb-4">
              <SearchBar />
            </div>
            <div className="space-y-2">
              <Link to="/restaurants" className="block py-2 text-gray-600 hover:text-primary-500">
                ร้านอาหาร
              </Link>
              <Link to="/order-tracking" className="block py-2 text-gray-600 hover:text-primary-500">
                ติดตามออเดอร์
              </Link>
              <Link to="/profile" className="block py-2 text-gray-600 hover:text-primary-500">
                โปรไฟล์
              </Link>
              <Link to="/login" className="block py-2 text-primary-500 font-medium">
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
