
// First create the utility functions
export const formatPrice = (price: number): string => {
  return `฿${price.toLocaleString('th-TH')}`
}

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} นาที`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} ชั่วโมง`
  }
  return `${hours} ชั่วโมง ${remainingMinutes} นาที`
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ''))
}
import { 
  formatPrice, 
  formatTime, 
  formatDate, 
  validateEmail, 
  validatePhone 
} from '../formatters'

describe('Formatter Utilities', () => {
  describe('formatPrice', () => {
    test('formats price correctly', () => {
      expect(formatPrice(100)).toBe('฿100')
      expect(formatPrice(1000)).toBe('฿1,000')
      expect(formatPrice(1500.50)).toBe('฿1,500.5')
    })

    test('handles zero price', () => {
      expect(formatPrice(0)).toBe('฿0')
    })
  })

  describe('formatTime', () => {
    test('formats minutes correctly', () => {
      expect(formatTime(30)).toBe('30 นาที')
      expect(formatTime(45)).toBe('45 นาที')
    })

    test('formats hours correctly', () => {
      expect(formatTime(60)).toBe('1 ชั่วโมง')
      expect(formatTime(120)).toBe('2 ชั่วโมง')
    })

    test('formats hours and minutes correctly', () => {
      expect(formatTime(90)).toBe('1 ชั่วโมง 30 นาที')
      expect(formatTime(150)).toBe('2 ชั่วโมง 30 นาที')
    })
  })

  describe('formatDate', () => {
    test('formats date correctly', () => {
      const testDate = '2024-01-15T14:30:00Z'
      const formatted = formatDate(testDate)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('14:30')
    })
  })

  describe('validateEmail', () => {
    test('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@domain.co.th')).toBe(true)
    })

    test('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    test('validates correct phone number', () => {
      expect(validatePhone('0812345678')).toBe(true)
      expect(validatePhone('081-234-5678')).toBe(true)
      expect(validatePhone('081 234 5678')).toBe(true)
    })

    test('rejects invalid phone number', () => {
      expect(validatePhone('123456789')).toBe(false) // too short
      expect(validatePhone('08123456789')).toBe(false) // too long
      expect(validatePhone('abc1234567')).toBe(false) // contains letters
      expect(validatePhone('')).toBe(false)
    })
  })
})
