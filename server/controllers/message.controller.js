const messageModel = require('../models/message.model');

const createMessage = async (req,res)=>{
    const {senderId, chatId, text} = req.body;

    try{

        if(!senderId, !chatId, !text) return res.status(400).json({message: "All fields (senderId, chatId, text) are required."});

        const newMessage = new messageModel({
            senderId,
            chatId,
            text
        });

        const response = await newMessage.save();

        res.status(200).json(response);

    }catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
};

const findMessage = async (req,res)=>{
    const {chatId} = req.params;

    try{

        const message = await messageModel.find({chatId});

        res.status(200).json(message);

    }catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
};



module.exports = {createMessage, findMessage};