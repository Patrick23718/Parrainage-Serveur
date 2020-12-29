const router = require("express").Router();
const Filiere = require("../models/Filiere");
const verifyToken = require("./auth/verifyToken");
const isAdmin = require("./auth/isAdmin");
const isSPAdmin = require("./auth/isSuperAdmin");
const multer = require("multer");

//! create department
router.post("/", (req, res, next) => {
  console.log(req.file);
  let filiere = new Filiere({
    nom: req.body.nom,
    code: req.body.code,
    departement: req.body.departement,
  });
  filiere
    .save()
    .then((result) => {
      res.status(201).json({
        message: "filiere créé avec succès",
        doc: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Erreur liée au serveur",
        error: err,
      });
    });
});

router.get("/", (req, res, next) => {
  Filiere.find()
    .select()
    .populate("departement")
    .exec()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        docs: result.map((doc) => {
          return {
            _id: doc._id,
            nom: doc.nom,
            code: doc.code,
            departement: doc.departement,
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Erreur liée au serveur",
        error: err,
      });
    });
});

router.get("/departement/:iddepartement", (req, res) => {
  const id = req.params.iddepartement;
  Filiere.find({ departement: id })
    .select()
    .populate("departement")
    .exec()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        docs: result.map((doc) => {
          return {
            _id: doc._id,
            nom: doc.nom,
            code: doc.code,
            departement: doc.departement,
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Erreur liée au serveur",
        error: err,
      });
    });
});

router.get("/:iddepartement/:idfiliere", (req, res, next) => {
  const id = req.params.idfiliere;
  const iddep = req.params.iddepartement;
  Filiere.findById(id)
    .select()
    .populate("departement")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          doc: result,
        });
      } else {
        res.status(404).json({
          message: "Not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Erreur liée au serveur",
        error: err,
      });
    });
});

router.put("/:idfiliere", (req, res) => {
  const id = req.params.idfiliere;
  const filiere = {};
  if (req.body.nom) filiere.nom = req.body.nom;
  if (req.body.code) filiere.code = req.body.code;
  if (req.body.departement) filiere.departement = req.body.departement;

  Filiere.updateOne({ _id: id }, { $set: filiere })
    .select()
    .populate("departement")
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "filiere mise à jour",
        doc: result,
        // request: {
        //   type: "GET",
        //   url: "http://localhost:5000/coupon/" + id,
        // },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Erreur liée au serveur",
        error: err,
      });
    });
});

router.delete("/:idfiliere", (req, res) => {
  const id = req.params.idfiliere;
  Filiere.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Erreur liée au serveur",
        error: err,
      });
    });
});
module.exports = router;
