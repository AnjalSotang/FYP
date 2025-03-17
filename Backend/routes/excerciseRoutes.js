const express = require("express")
const {addExcercise, getAllExcercises, getAllExcercisesForAdmin, getExcercise, deleteExcercise, updateExcercise, searchExercises} = require("../controller.js/admin/excerciseController")
const router = express.Router();
const upload = require("../helpers/upload"); 

// router.post('/addExercise', upload.array('equipment', 4), upload.single("image"), upload.single("video"), addExcercise);
router.post('/addExercise', upload.fields([ // Up to 4 files for 'equipment'
    { name: "image", maxCount: 1 },     // 1 file for 'image'
    { name: "video", maxCount: 1 }      // 1 file for 'video'
]), addExcercise);
router.get('/getExcercises', getAllExcercises)
router.get('/getExcercises/search', searchExercises)
router.get('/getExcercisesForAdmin', getAllExcercisesForAdmin)
router.get('/getExcercise/:id', getExcercise)
router.patch('/updateExcercise',upload.fields([ // Up to 4 files for 'equipment'
    { name: "image", maxCount: 1 },     // 1 file for 'image'
    { name: "video", maxCount: 1 }      // 1 file for 'video'
]), updateExcercise)
router.delete('/deleteExcercise/:id', deleteExcercise)

module.exports= router;