
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
