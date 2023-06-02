const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    rollNo : {
        type: Number,
        required: true
    },
    score : {
        type: Number,
        required: true
    },
    dob : {
        type: Date,
        required: true
    }
})
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;