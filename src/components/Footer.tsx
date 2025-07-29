
import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold">Tourderwang</span>
            </div>
            <p className="text-gray-300 mb-4">
              แอปพลิเคชันสั่งอาหารออนไลน์สำหรับชาววังสามหมอ อุดรธานี
            </p>
            <p className="text-gray-400 text-sm">
              เชื่อมต่อร้านอาหารท้องถิ่นกับลูกค้า ผ่านแพลตฟอร์มที่ใช้งานง่าย
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ลิงก์ด่วน</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurants" className="text-gray-300 hover:text-primary-500 transition-colors">
                  ร้านอาหาร
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="text-gray-300 hover:text-primary-500 transition-colors">
                  ติดตามออเดอร์
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-primary-500 transition-colors">
                  โปรไฟล์
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-2 text-gray-300">
              <li>วังสามหมอ อุดรธานี</li>
              <li>โทร: 042-xxx-xxx</li>
              <li>อีเมล: info@tourderwang.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Tourderwang. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
