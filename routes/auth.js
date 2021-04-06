const express = require('express')
const controller = require('../controllers/auth')
const router = express.Router()

// localhost:5000/api/auth/login
// router.get('/login', (req, res) => {
//     res.status(200).json({
//         login: true
//     })
// })
router.post('/login', controller.login)
// localhost:5000/api/auth/register
router.post('/register', controller.register)

module.exports = router
