const express = require('express')
const { getUsers, signupAdmin, loginAdmin } = require('../controllers/adminController')

const router = express.Router()

// admin auth routes
router.post('/signup', signupAdmin)
router.post('/login', loginAdmin)

router.get('/users', getUsers)

module.exports = router