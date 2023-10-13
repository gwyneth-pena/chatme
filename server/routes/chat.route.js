const express = require('express');
const {findChat, findUserChats, createChat} = require('../controllers/chat.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();


router.get('/find/:firstId/:secondId', auth, findChat);
router.post('/create', auth, createChat);
router.get('/:userId', auth, findUserChats);


module.exports = router;