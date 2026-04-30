const Admin = require('../models/adminModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// signup admin
const signupAdmin = async (req, res) => {
  const {firstName, lastName, email, password} = req.body

  try {
    const admin = await Admin.signup(firstName, lastName, email, password)

    // create a token
    const token = createToken(admin._id)

    res.status(200).json({email, token, admin})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// login admin
const loginAdmin = async (req, res) => {
  const {email, password} = req.body

  try {
    const admin = await Admin.login(email, password)

    // create a token
    const token = createToken(admin._id)

    res.status(200).json({email, token, admin})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await Admin.find()

    res.status(200).json({users: users})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = { signupAdmin, loginAdmin, getUsers }
