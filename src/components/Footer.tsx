import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tourderwang</h3>
            <p className="text-gray-300">
              แอปพลิเคชันสั่งอาหารสำหรับชุมชนวังสามหมอ อุดรธานี
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">ติดต่อเรา</h3>
            <p className="text-gray-300">
              อำเภอวังสามหมอ อุดรธานี
            </p>
            <p className="text-gray-300">
              โทร: 042-XXX-XXXX
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">เวลาให้บริการ</h3>
            <p className="text-gray-300">
              ทุกวัน 6:00 - 22:00 น.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Tourderwang. สงวนลิขสิทธิ์
          </p>
        </div>
      </div>
    </footer>
  )
}