const express = require("express");
const { createClassroom, 
    getallClassrooms, 
    addStudents ,
    addTeacher,
    updateClassroom,
    addPeriods,
    getClassroom} = require("../controllers/ClassroomController");

const { authorizeRoles } = require("../middlewares/rolemiddleware");

const router = express.Router();

router.route('/')
    .get(getallClassrooms)
    .post(authorizeRoles('Principal'),createClassroom)
    .patch(authorizeRoles('Principal'),updateClassroom)

router.route('/:classroomID')
    .get(getClassroom)

router.route('/addstudent')
    .patch(authorizeRoles('Principal', 'Teacher'),addStudents)

router.route('/addteacher')
    .patch(authorizeRoles('Principal'),addTeacher)

router.route('/addPeriod')
    .patch(authorizeRoles('Principal','Teacher'),addPeriods)

module.exports = router