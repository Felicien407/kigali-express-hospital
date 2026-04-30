const express = require('express')
const {
  getAppointmentsReport,
  getBillingReport,
  getSummaryReport
} = require('../controllers/reportController')

const router = express.Router()

router.get('/appointments', getAppointmentsReport)
router.get('/billing', getBillingReport)
router.get('/summary', getSummaryReport)

module.exports = router
