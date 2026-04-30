const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientSchema = new Schema({
  patientNumber: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  dateOfRegistration: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Patient', patientSchema)