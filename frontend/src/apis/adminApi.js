import axios from 'axios'

const API_BASE_URL = 'http://localhost:5007/api'

const adminApi = axios.create({
  baseURL: API_BASE_URL
})

// Add token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth endpoints
export const authApi = {
  signup: (data) => adminApi.post('/admin/signup', data),
  login: (data) => adminApi.post('/admin/login', data)
}

// Doctor endpoints
export const doctorApi = {
  create: (data) => adminApi.post('/doctors', data),
  getAll: () => adminApi.get('/doctors'),
  getById: (id) => adminApi.get(`/doctors/${id}`),
  update: (id, data) => adminApi.patch(`/doctors/${id}`, data),
  delete: (id) => adminApi.delete(`/doctors/${id}`)
}

// Patient endpoints
export const patientApi = {
  create: (data) => adminApi.post('/patients', data),
  getAll: () => adminApi.get('/patients'),
  getById: (id) => adminApi.get(`/patients/${id}`),
  update: (id, data) => adminApi.patch(`/patients/${id}`, data),
  delete: (id) => adminApi.delete(`/patients/${id}`)
}

// Appointment endpoints
export const appointmentApi = {
  create: (data) => adminApi.post('/appointments', data),
  getAll: () => adminApi.get('/appointments'),
  getByPatient: (patientId) => adminApi.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => adminApi.get(`/appointments/doctor/${doctorId}`),
  getById: (id) => adminApi.get(`/appointments/${id}`),
  update: (id, data) => adminApi.patch(`/appointments/${id}`, data),
  complete: (id, data) => adminApi.patch(`/appointments/${id}/complete`, data),
  cancel: (id) => adminApi.patch(`/appointments/${id}/cancel`),
  delete: (id) => adminApi.delete(`/appointments/${id}`)
}

// Bill endpoints
export const billApi = {
  create: (data) => adminApi.post('/bills', data),
  getAll: () => adminApi.get('/bills'),
  getByPatient: (patientId) => adminApi.get(`/bills/patient/${patientId}`),
  getById: (id) => adminApi.get(`/bills/${id}`),
  update: (id, data) => adminApi.patch(`/bills/${id}`, data),
  processPayment: (id, data) => adminApi.patch(`/bills/${id}/payment`, data),
  delete: (id) => adminApi.delete(`/bills/${id}`)
}

// Report endpoints
export const reportApi = {
  getAppointments: (params) => adminApi.get('/reports/appointments', { params }),
  getBilling: (params) => adminApi.get('/reports/billing', { params }),
  getSummary: () => adminApi.get('/reports/summary')
}

export default adminApi
