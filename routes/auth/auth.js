const router = require("express").Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");
const isAdmin = require("./isAdmin");
const isSPAdmin = require("./isSuperAdmin");
const { registerValidation, loginValidation } = require("../../validation");

router.get("/", isSPAdmin, (req, res) => {
  res.send("ca marche bien");
});

//! REGISTER
router.post("/register", async (req, res) => {
  // Lets validate the data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if the user email already exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(req.body.matricule, salt);
  if (req.body.password) {
    hashedPassword = await bcrypt.hash(req.body.password, salt);
  }

  // create a new user
  const user = new User({
    nom: req.body.nom,
    email: req.body.email,
    niveau: req.body.niveau,
    matricule: req.body.matricule,
    campus: req.body.campus,
    filiere: req.body.filiere,
    numero: req.body.numero,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      doc: savedUser,
    });
    //res.send({user : user._id})
  } catch (err) {
    res.status(400).json({
      message: "Erreur serveur",
      error: err,
    });
  }
});

//! LOGIN
router.post("/login", async (req, res) => {
  // Lets validate the data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if the user email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("wrong Email");

  //Password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("wrong Password");

  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  // res.header("auth-token", token).send(token);
  res.header("auth-token", token).json({
    message: "Log in successfuly",
    token: token,
    doc: user,
  });
});

router.put("/edit/:id", verifyToken, async (user, req, res, next) => {
  const id = req.params.id;
  if (id !== user)
    return res.status(400).json({
      message: "Vous n'avez pas le droit de modifier un autre utilisateur",
    });
  const updateUser = {};
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    updateUser.password = hashedPassword;
  }
  if (req.body.numero) updateUser.numero = req.body.numero;
  User.updateOne({ _id: id }, { $set: updateUser })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Coupon updated",
        doc: result,
        request: {
          type: "GET",
          url: "http://localhost:5000/coupon/" + id,
        },
      });
    });
});
module.exports = router;
