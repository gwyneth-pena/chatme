const chatModel = require('../models/chat.model');


const createChat = async (req,res)=>{
    const {firstId, secondId} = req.body;

    try{

        if(!firstId, !secondId) return res.status(400).json({message: "All fields (firstId, secondId) are required."});

        const chat = await chatModel.findOne({
            members: {$all:[firstId,secondId]}
        });

        if(chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstId, secondId]
        });

        const response = await newChat.save();

        res.status(200).json(response);

    }catch(error){
        console.log(error);
        return res.status(500).json(error);
    }

};

const findUserChats = async (req,res) =>{
    const userId = req.params.userId;

    try{
        const chats = await chatModel.find({
            members: {$in:[userId]}
        });

        return res.status(200).json(chats);

    }catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
};

const findChat = async (req,res) =>{
    const {firstId,secondId} = req.params;

    try{
        const chat = await chatModel.find({
            members: {$all:[firstId,secondId]}
        });

        return res.status(200).json(chat);

    }catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
};

module.exports = {findChat,findUserChats,createChat};