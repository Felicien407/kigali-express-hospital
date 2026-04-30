import React, { useState, useEffect } from 'react'
import { appointmentApi, patientApi, doctorApi } from '../apis/adminApi'
import '../styles/Management.css'

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    appointmentDate: '',
    reason: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        appointmentApi.getAll(),
        patientApi.getAll(),
        doctorApi.getAll()
      ])
      setAppointments(appointmentsRes.data)
      setPatients(patientsRes.data)
      setDoctors(doctorsRes.data)
    } catch (err) {
      setError('Failed to fetch data')
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
      await appointmentApi.create(formData)
      setFormData({
        patient: '',
        doctor: '',
        appointmentDate: '',
        reason: ''
      })
      setShowForm(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (appointmentId) => {
    try {
      const diagnosis = prompt('Enter diagnosis:')
      const prescription = prompt('Enter prescription:')
      const consultationFee = prompt('Enter consultation fee:') || 0

      if (diagnosis !== null && prescription !== null) {
        await appointmentApi.complete(appointmentId, { diagnosis, prescription, consultationFee })
        fetchData()
      }
    } catch (err) {
      setError('Failed to complete appointment')
    }
  }

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this appointment?')) {
      try {
        await appointmentApi.cancel(id)
        fetchData()
      } catch (err) {
        setError('Failed to cancel appointment')
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this appointment?')) {
      try {
        await appointmentApi.delete(id)
        fetchData()
      } catch (err) {
        setError('Failed to delete appointment')
      }
    }
  }

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p._id === patientId)
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown'
  }

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d._id === doctorId)
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown'
  }

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Appointments</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Schedule Appointment'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>Schedule New Appointment</h3>
          <div className="form-grid">
            <select
              name="patient"
              value={formData.patient}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>
                  {p.firstName} {p.lastName} ({p.patientNumber})
                </option>
              ))}
            </select>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>
                  {d.firstName} {d.lastName} ({d.specialization})
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="reason"
              placeholder="Reason for visit"
              value={formData.reason}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Scheduling...' : 'Schedule'}
          </button>
        </form>
      )}

      <div className="table-container">
        {appointments.length === 0 ? (
          <p className="empty-message">No appointments yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{getPatientName(appointment.patient)}</td>
                  <td>{getDoctorName(appointment.doctor)}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                  <td>{appointment.reason}</td>
                  <td>
                    <span className={`status-badge ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    {appointment.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleComplete(appointment._id)}
                          className="btn-success"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="btn-warning"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(appointment._id)}
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

export default AppointmentManagement
