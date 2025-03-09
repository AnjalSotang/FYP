const express = require("express")
const {addExcercise, getAllExcercises, getAllExcercisesForAdmin, getExcercise, deleteExcercise, updateExcercise, activeExercise, deactiveExercise} = require("../controller.js/excerciseController")
const router = express.Router();
const upload = require("../helpers/upload"); 

router.post('/addExcercise', upload.single("image"), upload.single("video"), addExcercise)
router.get('/getExcercises', getAllExcercises)
router.get('/getExcercisesForAdmin', getAllExcercisesForAdmin)
router.get('/getExcercise/:id', getExcercise)
router.patch('activateExcercise/:id', activeExercise)
router.patch('deactivateExcercise/:id', deactiveExercise)
router.patch('updateExcercise/:id', updateExcercise)
router.patch('seleteExcercise/:id', deleteExcercise)

module.exports= router;