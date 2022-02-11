const express = require('express');
const router = express.Router();
const profileController = require('../controllers/myprofile.controller')
const authJwt = require("../middleware/authJwt");

router.delete('/', profileController.deleteMyProfile)
router.put('/', profileController.updateMyProfile)


module.exports = router;
