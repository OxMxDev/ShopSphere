const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/user/register',authController.userRegister)
router.post('/user/login',authController.userLogin)
router.post('/user/logout',authController.userLogout)

module.exports = router