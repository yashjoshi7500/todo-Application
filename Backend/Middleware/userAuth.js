const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const { User } = require("../Models/tasks");


const  userAuth= async(req,res,next)=>{

    try
    {
    const{token} = req.cookies;

    if(!token)
    {
        return res.status(401).send("Token Doesnot exists");
    }

    let payload;
    
    try
    {
     payload = jwt.verify(token,process.env.SECRET_KEY)
    }
    catch(error)
    {
        res.status(401).send("Invalid Token Or Expired");
    }

    const {_id}=payload;
    const user = await User.findById(_id);

    if(!user)
    {
        return res.status(404).send("User doesnot exists");
    }

    req.user = user;

    next();


    }
    catch(error)
    {
        res.status(500).send("Internal Server Error");

    }
}

module.exports = userAuth;