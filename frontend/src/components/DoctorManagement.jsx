import React, { useState, useEffect } from 'react'
import { doctorApi } from '../apis/adminApi'
import '../styles/Management.css'

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    telephone: '',
    department: ''
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await doctorApi.getAll()
      setDoctors(response.data)
    } catch (err) {
      setError('Failed to fetch doctors')
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
      await doctorApi.create(formData)
      setFormData({
        firstName: '',
        lastName: '',
        specialization: '',
        telephone: '',
        department: ''
      })
      setShowForm(false)
      fetchDoctors()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create doctor')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await doctorApi.delete(id)
        fetchDoctors()
      } catch (err) {
        setError('Failed to delete doctor')
      }
    }
  }

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Doctors</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Doctor'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>Add New Doctor</h3>
          <div className="form-grid">
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
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
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
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Adding...' : 'Add Doctor'}
          </button>
        </form>
      )}

      <div className="table-container">
        {doctors.length === 0 ? (
          <p className="empty-message">No doctors yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Department</th>
                <th>Telephone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.firstName} {doctor.lastName}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.department}</td>
                  <td>{doctor.telephone}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(doctor._id)}
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

export default DoctorManagement
