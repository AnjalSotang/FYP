const express = require("express")
const {addExcercise, getAllExcercises, getAllExcercisesForAdmin, getExcercise, deleteExcercise, updateExcercise, searchExercises} = require("../controller.js/admin/excerciseController")
const { checkTokenAndRole } = require("../middleware/checkTokenAndRole");
const router = express.Router();
const upload = require("../helpers/upload"); 

// router.post('/addExercise', upload.array('equipment', 4), upload.single("image"), upload.single("video"), addExcercise);
router.post('/addExercise',upload.single("image"), addExcercise);
router.get('/getExcercises', getAllExcercises)
router.get('/getExcercises/search', searchExercises)
router.get('/getExcercisesForAdmin', getAllExcercisesForAdmin)
router.get('/getExcercise/:id', getExcercise)
router.patch('/updateExcercise',upload.single("image"), updateExcercise)
router.delete('/deleteExcercise/:id', deleteExcercise)

module.exports= router;