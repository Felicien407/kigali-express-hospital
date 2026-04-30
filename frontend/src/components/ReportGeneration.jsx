import React, { useState } from 'react'
import { reportApi } from '../apis/adminApi'
import '../styles/Reports.css'

const ReportGeneration = () => {
  const [reportType, setReportType] = useState('summary')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    paymentStatus: ''
  })

  const handleGenerateReport = async () => {
    setLoading(true)
    setError('')

    try {
      let reportData
      
      if (reportType === 'summary') {
        const res = await reportApi.getSummary()
        reportData = res.data
      } else if (reportType === 'appointments') {
        const params = {
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(filters.status && { status: filters.status })
        }
        const res = await reportApi.getAppointments(params)
        reportData = res.data
      } else if (reportType === 'billing') {
        const params = {
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus })
        }
        const res = await reportApi.getBilling(params)
        reportData = res.data
      }

      setReport(reportData)
    } catch (err) {
      setError('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const downloadReport = () => {
    const dataStr = JSON.stringify(report, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  return (
    <div className="report-section">
      <h2>Report Generation</h2>

      <div className="report-controls">
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="summary">Summary Report</option>
          <option value="appointments">Appointments Report</option>
          <option value="billing">Billing Report</option>
        </select>

        {reportType !== 'summary' && (
          <div className="filters">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              placeholder="Start Date"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              placeholder="End Date"
            />

            {reportType === 'appointments' && (
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}

            {reportType === 'billing' && (
              <select name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
              </select>
            )}
          </div>
        )}

        <button onClick={handleGenerateReport} disabled={loading} className="btn-primary">
          {loading ? 'Generating...' : 'Generate Report'}
        </button>

        {report && (
          <button onClick={downloadReport} className="btn-secondary">
            Download
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {report && (
        <div className="report-display">
          {reportType === 'summary' && (
            <div className="summary-grid">
              <div className="metric-card">
                <h4>Total Appointments</h4>
                <p>{report.summary.totalAppointments}</p>
              </div>
              <div className="metric-card completed">
                <h4>Completed</h4>
                <p>{report.summary.completedAppointments}</p>
              </div>
              <div className="metric-card">
                <h4>Scheduled</h4>
                <p>{report.summary.scheduledAppointments}</p>
              </div>
              <div className="metric-card cancelled">
                <h4>Cancelled</h4>
                <p>{report.summary.cancelledAppointments}</p>
              </div>
              <div className="metric-card">
                <h4>Total Bills</h4>
                <p>{report.summary.totalBills}</p>
              </div>
              <div className="metric-card paid">
                <h4>Total Paid</h4>
                <p>RWF {report.summary.totalPaid.toFixed(2)}</p>
              </div>
              <div className="metric-card">
                <h4>Total Billed</h4>
                <p>RWF {report.summary.totalBilled.toFixed(2)}</p>
              </div>
              <div className="metric-card pending">
                <h4>Total Pending</h4>
                <p>RWF {report.summary.totalPending.toFixed(2)}</p>
              </div>
            </div>
          )}

          {reportType === 'appointments' && (
            <div className="report-table">
              <h3>Appointments: {report.totalAppointments} Total</h3>
              <div className="summary-stats">
                <span>✓ Completed: {report.completed}</span>
                <span>○ Scheduled: {report.scheduled}</span>
                <span>✗ Cancelled: {report.cancelled}</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.appointments?.map(apt => (
                    <tr key={apt._id}>
                      <td>{apt.patient.firstName} {apt.patient.lastName}</td>
                      <td>{apt.doctor.firstName} {apt.doctor.lastName}</td>
                      <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                      <td>{apt.reason}</td>
                      <td>{apt.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'billing' && (
            <div className="report-table">
              <h3>Billing: {report.totalBills} Bills</h3>
              <div className="summary-stats">
                <span>Paid: {report.paid}</span>
                <span>Partial: {report.partial}</span>
                <span>Pending: {report.pending}</span>
                <span>Total: RWF {report.totalBilled.toFixed(2)}</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.bills?.map(bill => (
                    <tr key={bill._id}>
                      <td>{bill.patient.firstName} {bill.patient.lastName}</td>
                      <td>{bill.doctor.firstName} {bill.doctor.lastName}</td>
                      <td>RWF {bill.totalAmount.toFixed(2)}</td>
                      <td>RWF {bill.amountPaid.toFixed(2)}</td>
                      <td>RWF {bill.balanceDue.toFixed(2)}</td>
                      <td>{bill.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReportGeneration
