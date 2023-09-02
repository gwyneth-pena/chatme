const express = require('express');
const {registerUser, loginUser, findUser} = require('../controllers/user.controller');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:userId?', findUser);


module.exports = router;