const express = require("express"),
  router = express.Router(),
  multerLib = require("multer")(),
  {getPrediction, getAllPredictions} = require('../controllers')

router.post("/predict", multerLib.single('image'), getPrediction);
router.get('/predict/histories', getAllPredictions);
router.get('/tes', (req, res) => res.status(200).json({message:"helo"}))
module.exports = router;
