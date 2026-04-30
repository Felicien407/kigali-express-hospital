require('dotenv').config()

const dbConnect = require('./config/db.js')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const adminRoutes = require('./routes/admins')
const patientRoutes = require('./routes/patients')
const doctorRoutes = require('./routes/doctors')
const appointmentRoutes = require('./routes/appointments')
const billRoutes = require('./routes/bills')
const reportRoutes = require('./routes/reports')

// express app
const app = express()
  
// middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/admin', adminRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/bills', billRoutes)
app.use('/api/reports', reportRoutes)

dbConnect(app)