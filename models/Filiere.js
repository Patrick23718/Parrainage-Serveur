const mongoose = require("mongoose");
const FiliereSchema = mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("filiere", FiliereSchema);
