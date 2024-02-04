const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },password:{
        type: String,
        required: true

    }
});

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },password:{
        type: String,
        required: true

    },
    role: { type: String,
         enum: ['admin', 'employee'],
          default: 'employee' 
        },
    
});

const Employee = mongoose.model('Employee', employeeSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = {
    Employee: Employee,
    Admin: Admin
};
