const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', [
    check("email","Field cannot be empty").notEmpty(),
    check("password","Password should be longer than 4 and less than 20 characters").isLength({min:4, max:20}),
],controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['USER', 'ADMIN']), controller.getUsers)

module.exports = router;