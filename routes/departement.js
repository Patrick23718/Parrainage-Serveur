const router = require("express").Router();
const Departement = require("../models/Departement");
const verifyToken = require("./auth/verifyToken");
const isAdmin = require("./auth/isAdmin");
const isSPAdmin = require("./auth/isSuperAdmin");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

//! create department
router.post(
  "/",
  isSPAdmin,
  upload.single("departementImage"),
  (req, res, next) => {
    console.log(req.file);
    let departement = new Departement({
      nom: req.body.nom,
      departementImage: "",
    });
    if (req.file) departement.departementImage = req.file.path;
    departement
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Departement créé avec succès",
          doc: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Erreur liée au serveur",
          error: err,
        });
      });
  }
);

router.get("/", isSPAdmin, (req, res, next) => {
  Departement.find()
    .select()
    .exec()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        docs: result.map((doc) => {
          return {
            _id: doc._id,
            nom: doc.nom,
            departementImage: doc.departementImage,
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

router.get("/:idDepartement", isSPAdmin, (req, res, next) => {
  const id = req.params.idDepartement;
  Departement.findById(id)
    .select()
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

router.put(
  "/:idDepartement",
  isSPAdmin,
  upload.single("departementImage"),
  (req, res) => {
    const id = req.params.idDepartement;
    const departement = {};
    if (req.body.nom) departement.nom = req.body.nom;
    if (req.file) departement.departementImage = req.file.path;
    Departement.updateOne({ _id: id }, { $set: departement })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Departement updated",
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
  }
);

router.delete(
  "/:idDepartement",
  isSPAdmin,
  upload.single("departementImage"),
  (req, res) => {
    const id = req.params.idDepartement;
    Departement.remove({ _id: id })
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
  }
);
module.exports = router;
