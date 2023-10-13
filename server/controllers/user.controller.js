const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body;

        let user = await userModel.findOne({email});
    
        if(user){
    
            return res.status(400).json({message: "User already exists."});
    
        }else{
    
            if(!name || !email || !password) return res.status(400).json({message: "All fields are required."});
    
            if(!validator.isEmail(email)) return res.status(400).json({message: "Email is invalid."});
    
            if(!validator.isStrongPassword(password)) return res.status(400).json({message: 
                "Password should have at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character "});
    
            user = new userModel({name, email, password});
    
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
    
            await user.save();
    
            const token = createToken(user);
    
            return res.status(200).json({message:"User successfully registered.", data: {_id:user._id, name, email, token}});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }


};

const loginUser = async(req, res)=>{

    try {
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({message: "All fields are required."});
        
        let user = await userModel.findOne({email});

        if(!user) return res.status(400).json({message: "Invalid credentials."});

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return res.status(400).json({message: "Invalid credentials."});

        const token = createToken(user);
    
        return res.status(200).json({message:"User successfully logged in.", data: {_id:user._id, name:user.name, email, token}});

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

};

const findUser = async(req, res)=>{

    try {
        const userId = req.params.userId;
        let user = {};
        if(userId){
            user = await userModel.findById(userId);
            return res.status(200).json({data: {id:user._id, name:user.name, email: user.email}});

        }else{
            user = await userModel.find();
            return res.status(200).json({data: {user}});
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

};


const createToken = (user)=>{
    const jwtKey = process.env.JWT_SECRET;

    return jwt.sign({id:user._id, name: user.name}, jwtKey, {expiresIn:"3d"});
};

module.exports = { registerUser, loginUser, findUser };