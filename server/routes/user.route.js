const express = require('express');
const {registerUser, loginUser, findUser} = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:userId?', auth, findUser);


module.exports = router;