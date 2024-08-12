const express = require("express");
const { createNewUser, getUsersOrUserDetail ,deleteUser} = require("../controllers/UserController");
const { authorizeRoles } = require("../middlewares/rolemiddleware");

const router = express.Router();

router.route('/')
    .post(createNewUser)
    .get(getUsersOrUserDetail)

router.route('/:userID')
    .delete(deleteUser);

module.exports = router