const ClassroomModel = require("../models/ClassroomModel");
const UserModel = require("../models/UserModel");


const createClassroom = async (req,res) =>{
    try {
        const { name, teacher, schedule, students } = req.body;

        // Validate required fields
        if (!name || !schedule) {
            return res.status(400).json({ message: 'Name and schedule are required' });
        }

        // Use Classroom.create() to create and save the classroom in one step
        const savedClassroom = await ClassroomModel.create({
            name,
            teacher: teacher || undefined, // Assign teacher if provided
            schedule,
            students: students || []       // Assign students if provided, otherwise empty array
        });

        // Send a response with the saved classroom details
        return res.status(201).json({
            message: 'Classroom created successfully',
            classroom: savedClassroom
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating classroom', error: error.message });
    }
}

const getallClassrooms = async (req,res) =>{
    try{
        const allClassrooms = await ClassroomModel.find().lean();
        if(!allClassrooms){
            return res.status(300).json({message:"classroom not present"})
        }

        return res.status(200).json({
            classrooms:allClassrooms
        })

    } catch(error){
        return res.status(500).json({ message: 'Error getting classrooms', error: error.message });
    }
}

const getClassroom = async (req,res) =>{
    try {
        const classroomId = req.params.classroomId;

        if (!classroomId) {
            return res.status(400).json({ message: "classroom ID is required" });
        }

        const classroom = await ClassroomModel.findById(classroomId).lean()

        if (!classroom) {
            return res.status(404).json({ message: "classroom not found" });
        }

        return res.status(200).json({
            data : classroom
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateClassroom = async (req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ message: 'Error updating classroom', error: error.message });
    }
}

const addStudents = async (req,res)=>{
    try {
        const { classroomId, studentIds } = req.body;

        // Validate the input
        if (!classroomId || !studentIds || !Array.isArray(studentIds)) {
            return res.status(400).json({ message: 'Classroom ID and an array of Student IDs are required' });
        }
        // Check if the classroom exists
        const classroom = await ClassroomModel.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        // Array to store IDs of students successfully added
        const addedStudents = [];
        // Iterate over each student ID
        for (const studentId of studentIds) {
            // Check if the student exists
            const student = await UserModel.findById(studentId);
            if (!student) {
                continue; // Skip if the student doesn't exist
            }

            // Add the student to the classroom's students array if not already added
            if (!classroom.students.includes(studentId)) {
                classroom.students.push(studentId);
                addedStudents.push(studentId); // Keep track of added students
            }
        }

        // Save the updated classroom
        await classroom.save();

        // Return a success message with details of added students
        return res.status(200).json({
            message: 'Students added to the classroom successfully',
            addedStudents: addedStudents,
            classroom: classroom
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating classroom', error: error.message });
    }
}
const addTeacher = async (req,res)=>{
    try {
        const { classroomId, teacherId } = req.body;

        // Validate the input
        if (!classroomId || !teacherId) {
            return res.status(400).json({ message: 'Classroom ID and Teacher ID are required' });
        }

        // Check if the classroom exists
        const classroom = await ClassroomModel.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Check if the teacher exists
        const teacher = await UserModel.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        // Update the classroom with the new teacher
        classroom.teacher = teacherId;
        // Save the updated classroom
        await classroom.save();

        // Return a success message
        return res.status(200).json({
            message: 'Teacher added to the classroom successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating classroom', error: error.message });
    }
}

const addPeriods = async (req,res) =>{
    try {
        const { classroomId, day, periods } = req.body;

        // Validate the input
        if (!classroomId || !day || !periods || !Array.isArray(periods)) {
            return res.status(400).json({ message: 'Classroom ID, day, and an array of periods are required' });
        }

        // Check if the classroom exists
        const classroom = await ClassroomModel.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Find the schedule for the specified day
        const schedule = classroom.schedule.find(s => s.day === day);
        if (!schedule) {
            return res.status(404).json({ message: `No schedule found for ${day}` });
        }

        // Add the new periods to the schedule's periods array
        schedule.periods.push(...periods);

        // Save the updated classroom
        await classroom.save();

        // Return a success message with the updated classroom
        return res.status(200).json({
            message: 'Periods added to the schedule successfully',
        });
    } catch (error) {
        // Handle any errors that occur during the update process
        return res.status(500).json({
            message: 'Error adding periods to schedule',
            error: error.message
        });
    }
}

module.exports = {
    createClassroom,
    addStudents,
    getallClassrooms,
    addTeacher,
    updateClassroom,
    addPeriods,
    getClassroom
}