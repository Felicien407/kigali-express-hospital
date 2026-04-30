import React, { useState, useEffect } from 'react'
import { patientApi } from '../apis/adminApi'
import '../styles/Management.css'

const PatientManagement = () => {
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    patientNumber: '',
    firstName: '',
    lastName: '',
    address: '',
    telephone: '',
    gender: 'Male'
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await patientApi.getAll()
      setPatients(response.data)
    } catch (err) {
      setError('Failed to fetch patients')
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await patientApi.create(formData)
      setFormData({
        patientNumber: '',
        firstName: '',
        lastName: '',
        address: '',
        telephone: '',
        gender: 'Male'
      })
      setShowForm(false)
      fetchPatients()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create patient')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await patientApi.delete(id)
        fetchPatients()
      } catch (err) {
        setError('Failed to delete patient')
      }
    }
  }

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Patients</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Patient'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>Add New Patient</h3>
          <div className="form-grid">
            <input
              type="text"
              name="patientNumber"
              placeholder="Patient Number"
              value={formData.patientNumber}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="telephone"
              placeholder="Telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Adding...' : 'Add Patient'}
          </button>
        </form>
      )}

      <div className="table-container">
        {patients.length === 0 ? (
          <p className="empty-message">No patients yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Patient #</th>
                <th>Name</th>
                <th>Address</th>
                <th>Telephone</th>
                <th>Gender</th>
                <th>Date Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.patientNumber}</td>
                  <td>{patient.firstName} {patient.lastName}</td>
                  <td>{patient.address}</td>
                  <td>{patient.telephone}</td>
                  <td>{patient.gender}</td>
                  <td>{new Date(patient.dateOfRegistration).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(patient._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default PatientManagement
