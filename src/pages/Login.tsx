
import React from 'react'
import { Link } from 'react-router-dom'

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          เข้าสู่ระบบ
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center text-gray-600 py-10">
            <p className="text-lg">กำลังพัฒนา - ระบบเข้าสู่ระบบจะแสดงที่นี่</p>
            <Link to="/register" className="text-primary-600 hover:text-primary-500 mt-4 inline-block">
              ยังไม่มีบัญชี? สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
