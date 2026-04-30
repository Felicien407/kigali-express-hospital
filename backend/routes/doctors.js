const express = require('express')
const { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor } = require('../controllers/doctorController')

const router = express.Router()

// CRUD routes
router.post('/', createDoctor)
router.get('/', getAllDoctors)
router.get('/:id', getDoctorById)
router.patch('/:id', updateDoctor)
router.delete('/:id', deleteDoctor)

module.exports = router
