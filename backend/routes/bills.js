const express = require('express')
const {
  createBill,
  getAllBills,
  getBillsByPatient,
  getBillById,
  processPayment,
  updateBill,
  deleteBill
} = require('../controllers/billController')

const router = express.Router()

// CRUD routes
router.post('/', createBill)
router.get('/', getAllBills)
router.get('/patient/:patientId', getBillsByPatient)
router.get('/:id', getBillById)
router.patch('/:id', updateBill)
router.patch('/:id/payment', processPayment)
router.delete('/:id', deleteBill)

module.exports = router
