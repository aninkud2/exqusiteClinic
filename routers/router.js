const express = require('express');

const {newAdmin,adminLogin,adminForgotPassword,adminResetPassword,adminVerify,adminLogout} = require('../controllers/adminController')
const router = express.Router();



// admin routes
// Router.get('/alladmins', allAdmins) 
// Router.get('/admin/:id', oneAdmin)
// Router.delete('/admin/:id', deleteAdmin)
// Router.patch('/admin/:id', updateAdmin)
router.route('/adminsignup').post(newAdmin)
router.route('/adminVerify/:id').post(adminVerify)
router.route('/adminlogin').post(adminLogin)
router.route('/adminforgotpassword').post(adminForgotPassword)
router.route('/adminchangepassword/:id').post(adminResetPassword)
router.route('/logout/:id').post(adminLogout)
module.exports = router