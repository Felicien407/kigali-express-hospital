const express = require('express')
const {
  createAppointment,
  getAllAppointments,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getAppointmentById,
  updateAppointment,
  completeAppointment,
  cancelAppointment,
  deleteAppointment
} = require('../controllers/appointmentController')

const router = express.Router()

// CRUD routes
router.post('/', createAppointment)
router.get('/', getAllAppointments)
router.get('/patient/:patientId', getAppointmentsByPatient)
router.get('/doctor/:doctorId', getAppointmentsByDoctor)
router.get('/:id', getAppointmentById)
router.patch('/:id', updateAppointment)
router.patch('/:id/complete', completeAppointment)
router.patch('/:id/cancel', cancelAppointment)
router.delete('/:id', deleteAppointment)

module.exports = router
