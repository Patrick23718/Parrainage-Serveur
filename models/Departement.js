const mongoose = require("mongoose");
const DepartementSchema = mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },

  photoURL: {
    type: String,
  },

  code: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("departement", DepartementSchema);
