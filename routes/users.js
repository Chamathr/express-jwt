const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const authJwt = require("../middleware/authJwt");

router.get('/', [authJwt.authenticateToken], userController.allUsers);
router.post('/signup/', userController.addUsers);
router.post('/signin/', userController.signinUsers)
router.put('/:id', userController.updateUsers);
router.delete('/:id', userController.deleteUsers);

module.exports = router;
