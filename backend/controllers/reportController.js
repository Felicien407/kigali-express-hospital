const Appointment = require('../models/appointmentModel')
const Bill = require('../models/billModel')

// Generate appointments report
const getAppointmentsReport = async (req, res) => {
  try {
    const { startDate, endDate, status, doctorId, patientId } = req.query

    let filter = {}

    if (startDate && endDate) {
      filter.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    if (status) {
      filter.status = status
    }

    if (doctorId) {
      filter.doctor = doctorId
    }

    if (patientId) {
      filter.patient = patientId
    }

    const appointments = await Appointment.find(filter)
      .populate('patient')
      .populate('doctor')
      .sort({ appointmentDate: -1 })

    const report = {
      totalAppointments: appointments.length,
      completed: appointments.filter(a => a.status === 'completed').length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      appointments
    }

    res.status(200).json(report)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Generate billing report
const getBillingReport = async (req, res) => {
  try {
    const { startDate, endDate, paymentStatus, patientId } = req.query

    let filter = {}

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus
    }

    if (patientId) {
      filter.patient = patientId
    }

    const bills = await Bill.find(filter)
      .populate('appointment')
      .populate('patient')
      .populate('doctor')
      .sort({ createdAt: -1 })

    const totalBilled = bills.reduce((sum, bill) => sum + bill.totalAmount, 0)
    const totalPaid = bills.reduce((sum, bill) => sum + bill.amountPaid, 0)
    const totalPending = bills.reduce((sum, bill) => sum + bill.balanceDue, 0)

    const report = {
      totalBills: bills.length,
      totalBilled,
      totalPaid,
      totalPending,
      paid: bills.filter(b => b.paymentStatus === 'paid').length,
      partial: bills.filter(b => b.paymentStatus === 'partial').length,
      pending: bills.filter(b => b.paymentStatus === 'pending').length,
      bills
    }

    res.status(200).json(report)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Generate summary report
const getSummaryReport = async (req, res) => {
  try {
    const appointments = await Appointment.find()
    const bills = await Bill.find()

    const totalAppointments = appointments.length
    const totalBilled = bills.reduce((sum, bill) => sum + bill.totalAmount, 0)
    const totalPaid = bills.reduce((sum, bill) => sum + bill.amountPaid, 0)
    const totalPending = bills.reduce((sum, bill) => sum + bill.balanceDue, 0)

    const report = {
      summary: {
        totalAppointments,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        scheduledAppointments: appointments.filter(a => a.status === 'scheduled').length,
        cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
        totalBills: bills.length,
        totalBilled,
        totalPaid,
        totalPending,
        paidBills: bills.filter(b => b.paymentStatus === 'paid').length,
        partialBills: bills.filter(b => b.paymentStatus === 'partial').length,
        pendingBills: bills.filter(b => b.paymentStatus === 'pending').length
      }
    }

    res.status(200).json(report)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getAppointmentsReport,
  getBillingReport,
  getSummaryReport
}
