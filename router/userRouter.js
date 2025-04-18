const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const protect = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register', userCtrl.register)

router.post('/activation', userCtrl.activateEMail)

router.post('/login', userCtrl.login)

router.post('/refresh_token', userCtrl.getAccessToken)

router.post('/forgot-password', userCtrl.forgotPassword)

router.post('/reset-password', protect, userCtrl.resetPassword)

router.get('/infor', protect, userCtrl.getUserInfor)

router.get('/all_infor', protect, authAdmin, userCtrl.getUsersAllInfor)

router.get('/logout', userCtrl.logout)

router.put('/update', protect, userCtrl.updateUser)

router.put('/update_role/:id', protect, authAdmin, userCtrl.updateUsersRole)

router.delete('/delete/:id', protect, authAdmin, userCtrl.deleteUser)

// Social Login
router.post('/google_login', userCtrl.googleLogin)

router.post('/facebook_login', userCtrl.facebookLogin)

module.exports = router