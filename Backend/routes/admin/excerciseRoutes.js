const express = require("express")
const {addExcercise, getAllExcercises, getAllExcercisesForAdmin, getExcercise, deleteExcercise, updateExcercise, searchExercises, getExerciseMetrics} = require("../../controller/admin/excerciseController")
const { checkTokenAndRole } = require("../../middleware/checkTokenAndRole");
const router = express.Router();
const upload = require("../../middleware/upload"); 

// router.post('/addExercise', upload.array('equipment', 4), upload.single("image"), upload.single("video"), addExcercise);
router.post('/admin/excercise',checkTokenAndRole('admin'), upload.single("image"), addExcercise);
router.get('/getExcercises', getAllExcercises)
router.get('/admin/excercises/metrics', checkTokenAndRole('admin'), getExerciseMetrics)
router.get('/getExcercises/search', searchExercises)
router.get('/getExcercisesForAdmin', getAllExcercisesForAdmin)
router.get('/getExcercise/:id', getExcercise)
router.patch('/admin/excercise',checkTokenAndRole('admin'), upload.single("image"), updateExcercise)
router.delete('/admin/excercise/:id', checkTokenAndRole('admin'), deleteExcercise)

module.exports= router;