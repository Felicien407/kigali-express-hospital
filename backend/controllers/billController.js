const Bill = require('../models/billModel')
const Appointment = require('../models/appointmentModel')

// Create bill
const createBill = async (req, res) => {
  const { appointment, patient, doctor, services, consultationFee } = req.body

  try {
    if (!appointment || !patient || !doctor) {
      throw Error('Appointment, patient, and doctor are required')
    }

    let totalAmount = consultationFee || 0
    if (services && Array.isArray(services)) {
      services.forEach(service => {
        service.total = service.quantity * service.unitPrice
        totalAmount += service.total
      })
    }

    const bill = await Bill.create({
      appointment,
      patient,
      doctor,
      services: services || [],
      consultationFee: consultationFee || 0,
      totalAmount,
      balanceDue: totalAmount
    })

    const populatedBill = await bill.populate(['appointment', 'patient', 'doctor'])
    res.status(201).json(populatedBill)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('appointment')
      .populate('patient')
      .populate('doctor')
      .sort({ createdAt: -1 })
    res.status(200).json(bills)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get bills by patient
const getBillsByPatient = async (req, res) => {
  const { patientId } = req.params

  try {
    const bills = await Bill.find({ patient: patientId })
      .populate('appointment')
      .populate('patient')
      .populate('doctor')
      .sort({ createdAt: -1 })
    res.status(200).json(bills)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get single bill
const getBillById = async (req, res) => {
  const { id } = req.params

  try {
    const bill = await Bill.findById(id)
      .populate('appointment')
      .populate('patient')
      .populate('doctor')

    if (!bill) {
      throw Error('Bill not found')
    }
    res.status(200).json(bill)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Process payment
const processPayment = async (req, res) => {
  const { id } = req.params
  const { amountPaid, paymentMethod, paymentDate } = req.body

  try {
    const bill = await Bill.findById(id)

    if (!bill) {
      throw Error('Bill not found')
    }

    const totalPaid = bill.amountPaid + amountPaid
    const balanceDue = Math.max(0, bill.totalAmount - totalPaid)

    let paymentStatus = 'pending'
    if (totalPaid > 0 && balanceDue > 0) {
      paymentStatus = 'partial'
    } else if (balanceDue === 0) {
      paymentStatus = 'paid'
    }

    const updatedBill = await Bill.findByIdAndUpdate(
      id,
      {
        amountPaid: totalPaid,
        balanceDue,
        paymentStatus,
        paymentMethod,
        paymentDate: paymentDate || new Date()
      },
      { new: true }
    ).populate('appointment').populate('patient').populate('doctor')

    res.status(200).json(updatedBill)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Update bill
const updateBill = async (req, res) => {
  const { id } = req.params
  const { services, consultationFee } = req.body

  try {
    const bill = await Bill.findById(id)

    if (!bill) {
      throw Error('Bill not found')
    }

    let totalAmount = consultationFee || bill.consultationFee || 0
    if (services && Array.isArray(services)) {
      services.forEach(service => {
        service.total = service.quantity * service.unitPrice
        totalAmount += service.total
      })
    }

    const balanceDue = Math.max(0, totalAmount - (bill.amountPaid || 0))

    const updatedBill = await Bill.findByIdAndUpdate(
      id,
      {
        services: services || bill.services,
        consultationFee: consultationFee || bill.consultationFee,
        totalAmount,
        balanceDue
      },
      { new: true }
    ).populate('appointment').populate('patient').populate('doctor')

    res.status(200).json(updatedBill)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete bill
const deleteBill = async (req, res) => {
  const { id } = req.params

  try {
    const bill = await Bill.findByIdAndDelete(id)
    if (!bill) {
      throw Error('Bill not found')
    }
    res.status(200).json({ message: 'Bill deleted' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createBill,
  getAllBills,
  getBillsByPatient,
  getBillById,
  processPayment,
  updateBill,
  deleteBill
}
