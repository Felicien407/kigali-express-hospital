import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedAdmin = localStorage.getItem('admin')
    
    if (storedToken && storedAdmin) {
      setToken(storedToken)
      setAdmin(JSON.parse(storedAdmin))
    }
    setLoading(false)
  }, [])

  const login = (adminData, token) => {
    setAdmin(adminData)
    setToken(token)
    localStorage.setItem('token', token)
    localStorage.setItem('admin', JSON.stringify(adminData))
  }

  const logout = () => {
    setAdmin(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
  }

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
