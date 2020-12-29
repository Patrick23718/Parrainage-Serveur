const mongoose = require("mongoose");
const DepartementSchema = mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },

  departementImage: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("departement", DepartementSchema);
