import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import DoctorManagement from '../components/DoctorManagement'
import PatientManagement from '../components/PatientManagement'
import AppointmentManagement from '../components/AppointmentManagement'
import BillingManagement from '../components/BillingManagement'
import ReportGeneration from '../components/ReportGeneration'
import '../styles/Dashboard.css'

const DashboardPage = () => {
  const { admin, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('doctors')

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>Hospital Management System</h1>
        </div>
        <div className="nav-info">
          <span>Welcome, {admin?.firstName} {admin?.lastName}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            Doctors
          </button>
          <button
            className={`tab ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            Patients
          </button>
          <button
            className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button
            className={`tab ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing
          </button>
          <button
            className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'doctors' && <DoctorManagement />}
          {activeTab === 'patients' && <PatientManagement />}
          {activeTab === 'appointments' && <AppointmentManagement />}
          {activeTab === 'billing' && <BillingManagement />}
          {activeTab === 'reports' && <ReportGeneration />}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
