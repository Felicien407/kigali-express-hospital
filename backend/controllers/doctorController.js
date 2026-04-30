const Doctor = require('../models/doctorModel')

// create doctor (admin only)
const createDoctor = async (req, res) => {
  const {firstName, lastName, specialization, telephone, department} = req.body

  try {
    if (!firstName || !lastName || !specialization || !telephone || !department) {
      throw Error('All fields must be filled')
    }

    const doctor = await Doctor.create({ 
      firstName, 
      lastName, 
      specialization, 
      telephone, 
      department 
    })

    res.status(201).json(doctor)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({createdAt: -1})
    res.status(200).json(doctors)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// get single doctor
const getDoctorById = async (req, res) => {
  const {id} = req.params

  try {
    const doctor = await Doctor.findById(id)
    if (!doctor) {
      throw Error('Doctor not found')
    }
    res.status(200).json(doctor)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// update doctor
const updateDoctor = async (req, res) => {
  const {id} = req.params

  try {
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
    if (!doctor) {
      throw Error('Doctor not found')
    }
    res.status(200).json(doctor)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete doctor
const deleteDoctor = async (req, res) => {
  const {id} = req.params

  try {
    const doctor = await Doctor.findByIdAndDelete(id)
    if (!doctor) {
      throw Error('Doctor not found')
    }
    res.status(200).json({message: 'Doctor deleted'})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor }
