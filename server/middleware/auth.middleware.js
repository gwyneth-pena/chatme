const jwt = require('jsonwebtoken');


const verifyToken = (req,res,next)=>{
    const auth= req.get('authorization');

    if(auth){
        
        const jwtKey = process.env.JWT_SECRET;
        const token = auth.split(' ')[1];

        try{
            jwt.verify(token, jwtKey);
            next();
        }catch(err){
            return res.status(401).json({"message":"Invalid token"});
        }

    }else{
        res.status(403).json({"message":"Please provide a valid token."});
    }
};


module.exports = verifyToken;