const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    phone: { type: String },
    password: { type: String, required: true },  
    
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
