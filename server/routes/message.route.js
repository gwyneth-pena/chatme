const express = require('express');
const {createMessage, findMessage} = require('../controllers/message.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();


router.post('/create', auth, createMessage);
router.get('/:chatId', auth, findMessage);


module.exports = router;