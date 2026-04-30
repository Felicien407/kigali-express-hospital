const Appointment = require('../models/appointmentModel')
const Bill = require('../models/billModel')

// Create appointment
const createAppointment = async (req, res) => {
  const { patient, doctor, appointmentDate, reason } = req.body

  try {
    if (!patient || !doctor || !appointmentDate || !reason) {
      throw Error('All fields must be filled')
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      appointmentDate,
      reason
    })

    const populatedAppointment = await appointment.populate(['patient', 'doctor'])
    res.status(201).json(populatedAppointment)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient')
      .populate('doctor')
      .sort({ appointmentDate: -1 })
    res.status(200).json(appointments)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get appointments by patient
const getAppointmentsByPatient = async (req, res) => {
  const { patientId } = req.params

  try {
    const appointments = await Appointment.find({ patient: patientId })
      .populate('patient')
      .populate('doctor')
      .sort({ appointmentDate: -1 })
    res.status(200).json(appointments)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get appointments by doctor
const getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params

  try {
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient')
      .populate('doctor')
      .sort({ appointmentDate: -1 })
    res.status(200).json(appointments)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get single appointment
const getAppointmentById = async (req, res) => {
  const { id } = req.params

  try {
    const appointment = await Appointment.findById(id)
      .populate('patient')
      .populate('doctor')

    if (!appointment) {
      throw Error('Appointment not found')
    }
    res.status(200).json(appointment)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Update appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params

  try {
    const appointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .populate('patient')
      .populate('doctor')

    if (!appointment) {
      throw Error('Appointment not found')
    }
    res.status(200).json(appointment)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Complete appointment (mark as completed and create bill)
const completeAppointment = async (req, res) => {
  const { id } = req.params
  const { diagnosis, prescription, consultationFee } = req.body

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: 'completed',
        diagnosis,
        prescription
      },
      { new: true }
    ).populate('patient').populate('doctor')

    if (!appointment) {
      throw Error('Appointment not found')
    }

    // Create bill
    const bill = await Bill.create({
      appointment: appointment._id,
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      consultationFee: consultationFee || 0,
      totalAmount: consultationFee || 0,
      balanceDue: consultationFee || 0
    })

    res.status(200).json({ appointment, bill })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Cancel appointment
const cancelAppointment = async (req, res) => {
  const { id } = req.params

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    ).populate('patient').populate('doctor')

    if (!appointment) {
      throw Error('Appointment not found')
    }
    res.status(200).json(appointment)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params

  try {
    const appointment = await Appointment.findByIdAndDelete(id)
    if (!appointment) {
      throw Error('Appointment not found')
    }
    res.status(200).json({ message: 'Appointment deleted' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getAppointmentById,
  updateAppointment,
  completeAppointment,
  cancelAppointment,
  deleteAppointment
}
