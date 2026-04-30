const Patient = require('../models/patientsModel')

// create patient (admin only)
const createPatient = async (req, res) => {
  const {patientNumber, firstName, lastName, address, telephone, gender} = req.body

  try {
    if (!patientNumber || !firstName || !lastName || !address || !telephone || !gender) {
      throw Error('All fields must be filled')
    }

    // check for duplicate patient number
    const numberExists = await Patient.findOne({ patientNumber })
    if (numberExists) {
      throw Error('Patient number already in use')
    }

    const patient = await Patient.create({ 
      patientNumber, 
      firstName, 
      lastName, 
      address, 
      telephone, 
      gender 
    })

    res.status(201).json(patient)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({dateOfRegistration: -1})
    res.status(200).json(patients)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// get single patient
const getPatientById = async (req, res) => {
  const {id} = req.params

  try {
    const patient = await Patient.findById(id)
    if (!patient) {
      throw Error('Patient not found')
    }
    res.status(200).json(patient)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// update patient
const updatePatient = async (req, res) => {
  const {id} = req.params

  try {
    const patient = await Patient.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
    if (!patient) {
      throw Error('Patient not found')
    }
    res.status(200).json(patient)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete patient
const deletePatient = async (req, res) => {
  const {id} = req.params

  try {
    const patient = await Patient.findByIdAndDelete(id)
    if (!patient) {
      throw Error('Patient not found')
    }
    res.status(200).json({message: 'Patient deleted'})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = { createPatient, getAllPatients, getPatientById, updatePatient, deletePatient }