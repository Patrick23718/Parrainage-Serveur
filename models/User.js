const { number, string } = require("@hapi/joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },

  niveau: {
    type: Number,
    required: true,
  },

  matricule: {
    type: String,
    required: true,
  },

  campus: {
    type: String,
    required: true,
  },

  filiere: {
    type: String,
    //ref: "filiere",
    required: true,
  },

  role: {
    type: Number, // 0 as default for student, 1 for admin, 2 for super admin
    default: 0,
  },

  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  numero: {
    type: String,
    default: "",
    required: false,
    min: 9,
  },
  password: {
    type: String,
    required: false,
    min: 6,
    max: 1024,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
