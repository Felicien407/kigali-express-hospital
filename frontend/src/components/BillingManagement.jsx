import React, { useState, useEffect } from 'react'
import { billApi, appointmentApi, patientApi, doctorApi } from '../apis/adminApi'
import '../styles/Management.css'

const BillingManagement = () => {
  const [bills, setBills] = useState([])
  const [appointments, setAppointments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    appointment: '',
    consultationFee: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [billsRes, appointmentsRes] = await Promise.all([
        billApi.getAll(),
        appointmentApi.getAll()
      ])
      setBills(billsRes.data)
      setAppointments(appointmentsRes.data.filter(a => a.status === 'completed'))
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
      const appointment = appointments.find(a => a._id === formData.appointment)
      await billApi.create({
        appointment: formData.appointment,
        patient: appointment.patient._id,
        doctor: appointment.doctor._id,
        consultationFee: parseFloat(formData.consultationFee) || 0,
        totalAmount: parseFloat(formData.consultationFee) || 0,
        balanceDue: parseFloat(formData.consultationFee) || 0
      })
      setFormData({ appointment: '', consultationFee: 0 })
      setShowForm(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create bill')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (billId) => {
    const amount = prompt('Enter payment amount:', '0')
    const method = prompt('Payment method (cash/card/transfer/cheque):', 'cash')

    if (amount && method) {
      try {
        await billApi.processPayment(billId, {
          amountPaid: parseFloat(amount),
          paymentMethod: method
        })
        fetchData()
      } catch (err) {
        setError('Failed to process payment')
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this bill?')) {
      try {
        await billApi.delete(id)
        fetchData()
      } catch (err) {
        setError('Failed to delete bill')
      }
    }
  }

  const getPatientName = (patientId) => {
    const appointment = appointments.find(a => a._id === patientId)
    return appointment ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Unknown'
  }

  const getDoctorName = (doctorId) => {
    const appointment = appointments.find(a => a._id === doctorId)
    return appointment ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 'Unknown'
  }

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Billing</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Create Bill'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h3>Create New Bill</h3>
          <div className="form-grid">
            <select
              name="appointment"
              value={formData.appointment}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Completed Appointment</option>
              {appointments.map(a => (
                <option key={a._id} value={a._id}>
                  {a.patient.firstName} {a.patient.lastName} - Dr. {a.doctor.firstName} {a.doctor.lastName}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="consultationFee"
              placeholder="Consultation Fee"
              value={formData.consultationFee}
              onChange={handleInputChange}
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Bill'}
          </button>
        </form>
      )}

      <div className="table-container">
        {bills.length === 0 ? (
          <p className="empty-message">No bills yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill._id.slice(0, 8)}</td>
                  <td>{bill.patient.firstName} {bill.patient.lastName}</td>
                  <td>{bill.doctor.firstName} {bill.doctor.lastName}</td>
                  <td>RWF {bill.totalAmount.toFixed(2)}</td>
                  <td>RWF {bill.amountPaid.toFixed(2)}</td>
                  <td>RWF {bill.balanceDue.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${bill.paymentStatus}`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handlePayment(bill._id)}
                      className="btn-success"
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => handleDelete(bill._id)}
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

export default BillingManagement
