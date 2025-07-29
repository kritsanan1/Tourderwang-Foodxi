
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { restaurantService, menuService } from '../lib/supabase'

interface SearchResult {
  id: string
  name: string
  type: 'restaurant' | 'dish'
  restaurant_name?: string
  price?: number
  image_url?: string
}

interface SearchFilters {
  cuisineType: string
  priceRange: string
  rating: number
  deliveryTime: string
  isOpen: boolean
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    cuisineType: '',
    priceRange: '',
    rating: 0,
    deliveryTime: '',
    isOpen: false
  })
  
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchWithDelay = setTimeout(() => {
      if (query.length > 2) {
        performSearch()
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(searchWithDelay)
  }, [query, filters])

  const performSearch = async () => {
    setLoading(true)
    try {
      // Search restaurants
      const restaurants = await restaurantService.search(query, filters)
      const restaurantResults: SearchResult[] = restaurants.map(r => ({
        id: r.id,
        name: r.name,
        type: 'restaurant' as const,
        image_url: r.image_url
      }))

      // Search menu items
      const menuItems = await menuService.search(query, filters)
      const dishResults: SearchResult[] = menuItems.map(m => ({
        id: m.id,
        name: m.name,
        type: 'dish' as const,
        restaurant_name: m.restaurant?.name,
        price: m.price,
        image_url: m.image_url
      }))

      setResults([...restaurantResults, ...dishResults])
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'restaurant') {
      navigate(`/restaurant/${result.id}`)
    } else {
      // Navigate to restaurant with item highlighted
      navigate(`/restaurant/${result.id}?highlight=${result.id}`)
    }
    setShowResults(false)
    setQuery('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/restaurants?q=${encodeURIComponent(query)}`)
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 2 && setShowResults(true)}
            placeholder="ค้นหาร้านอาหาร อาหาร หรือเครื่องดื่ม..."
            className="flex-1 px-6 py-4 text-lg border-none outline-none"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 text-gray-500 hover:text-gray-700 border-l"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 transition-colors"
          >
            ค้นหา
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 p-6 z-50">
          <h3 className="text-lg font-semibold mb-4">ตัวกรองขั้นสูง</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทอาหาร
              </label>
              <select
                value={filters.cuisineType}
                onChange={(e) => setFilters({...filters, cuisineType: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">ทั้งหมด</option>
                <option value="อาหารไทย">อาหารไทย</option>
                <option value="อาหารจีน">อาหารจีน</option>
                <option value="อาหารฝรั่ง">อาหารฝรั่ง</option>
                <option value="เครื่องดื่ม">เครื่องดื่ม</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ช่วงราคา
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">ทั้งหมด</option>
                <option value="0-50">0-50 ฿</option>
                <option value="51-100">51-100 ฿</option>
                <option value="101-200">101-200 ฿</option>
                <option value="201+">201+ ฿</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คะแนนขั้นต่ำ
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={0}>ทั้งหมด</option>
                <option value={3}>3+ ดาว</option>
                <option value={4}>4+ ดาว</option>
                <option value={4.5}>4.5+ ดาว</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เวลาส่ง
              </label>
              <select
                value={filters.deliveryTime}
                onChange={(e) => setFilters({...filters, deliveryTime: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">ทั้งหมด</option>
                <option value="0-15">0-15 นาที</option>
                <option value="16-30">16-30 นาที</option>
                <option value="31-45">31-45 นาที</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isOpen"
                checked={filters.isOpen}
                onChange={(e) => setFilters({...filters, isOpen: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isOpen" className="text-sm font-medium text-gray-700">
                เฉพาะร้านที่เปิดอยู่
              </label>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setFilters({
                cuisineType: '',
                priceRange: '',
                rating: 0,
                deliveryTime: '',
                isOpen: false
              })}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ล้างตัวกรอง
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
            >
              ใช้ตัวกรอง
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 max-h-96 overflow-y-auto z-40">
          {loading ? (
            <div className="p-4 text-center text-gray-500">กำลังค้นหา...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    {result.type === 'restaurant' ? '🏪' : '🍽️'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{result.name}</div>
                    {result.type === 'dish' && (
                      <div className="text-sm text-gray-500">
                        {result.restaurant_name} • {result.price} ฿
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {result.type === 'restaurant' ? 'ร้านอาหาร' : 'เมนู'}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">ไม่พบผลการค้นหา</div>
          )}
        </div>
      )}
    </div>
  )
}
