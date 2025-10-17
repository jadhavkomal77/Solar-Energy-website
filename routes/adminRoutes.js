const router = require("express").Router()
const {
    register,
  login,
  logout,
  getProfile,
  updateProfile,
} = require('../controller/adminController')
const auth = require("../middleware/auth")


router

.post('/register', register)
.post('/login', login)
.post('/logout', auth, logout)
.get('/profile', auth, getProfile)
.put('/profileupdate', auth, updateProfile)

module.exports = router