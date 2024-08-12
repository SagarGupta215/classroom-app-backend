const express = require("express");
const UserRouter = require('./UserRoute')
const AuthRouter = require('./AuthRoute')
const ClassroomRouter = require('./ClassroomRoute');
const authMiddleware = require("../middlewares/authmiddleware");
const router = express.Router();


router.use('/user',UserRouter)
router.use('/auth',AuthRouter)
router.use('/classroom',ClassroomRouter)


module.exports = router
