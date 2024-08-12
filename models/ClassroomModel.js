const mongoose = require('mongoose');

// Sub-schema for a period in the timetable
const periodSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
});

// Sub-schema for the classroom's schedule
const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  periods: {
    type: [periodSchema], // Array of periods for the specific day
    default: undefined    // This ensures 'periods' is optional
  } 
});

// Main classroom schema
const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    default: undefined
  },
  schedule: [scheduleSchema], // Array of schedules for different days
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel' // Reference to the User model
  }]
});


// Validation to ensure each period is within the day's start and end time
classroomSchema.pre('save', function (next) {
    const classroom = this;
  
    classroom.schedule.forEach(daySchedule => {
      daySchedule.periods.forEach(period => {
        if (period.startTime < daySchedule.startTime || period.endTime > daySchedule.endTime) {
          return next(new Error(`Period for ${period.subject} on ${daySchedule.day} must be within the classroom's scheduled time.`));
        }
      });
    });
  
    next();
  });
  
  const ClassroomModel = mongoose.model('ClassroomModel', classroomSchema);
  
  module.exports = ClassroomModel;