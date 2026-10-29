const express = require("express");
const main = require("./database");
const validateUser = require("./api_validate/validateUser");
const validateTask= require("./api_validate/validateTask");
const bcrypt = require("bcrypt");
const {User,Task} = require("./Models/tasks");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userAuth = require("./Middleware/userAuth");


const app = express();


app.use(express.json());//middleware
app.use(cookieParser())//middleware


app.post("/register",async(req,res)=>{

    try
    {

        console.log(typeof req.body);

    validateUser(req.body);

    req.body.password=await bcrypt.hash(req.body.password,10);
    //here we are using auto generated technique to generate salt and hash 

    const result = await User.create(req.body);
    console.log(result);

    res.status(201).send("User Created Successfully");

    

    }
    catch(error)
    {
        res.status(400).send("Error Detected :"+error.message)
    }



})


app.post("/tasks",userAuth,async(req,res)=>{

    try
    {
    validateTask(req.body);

    await Task.create({...req.body,userId:req.user._id});
    res.status(201).send("Task Created Successfully");

    }
    catch(error)
    {
        res.status(400).send("Error Detected:"+error.message);
    }



})



app.get("/tasks",userAuth,async(req,res)=>{

    try
    {
         const task = await  Task.findOne({userId:req.user._id});

         if(!task)
         {
            return res.status(404).send("User doesnot exists");
         }

         res.send(task);

    }
    catch(error)
    {
        res.status(500).send("Internal Server Error");
    }
})


app.patch("/tasks",userAuth,async(req,res)=>{

    try
    {
    const result = await Task.updateOne(
    {userId:req.body.userId},
    {$set:{completed:req.body.completed}}
    );

    res.send("Updated Successfully");
    }
    catch(error)
    {
        res.status(500).send("Internal Server Error");
    }
})


app.post("/login",async(req,res)=>{

    try
    {
    const {emailId,password}=req.body;

    
    
    if(!validator.isEmail(emailId))
        return res.status(400).send("Enter a valid EmailId ");

    const user= await User.findOne({emailId});

    
    if(!user)
        return res.status(401).send("Invalid Email or Password");

    const isPasswordCorrect = user.verifyPassword(password);

    if(!isPasswordCorrect)
        return res.status(401).send("Invalid Email or Password");

    const jwtToken=user.getJWT();
    
    res.cookie("token",jwtToken);

    res.status(200).send("User Login Successfully");

    }
    catch(error)
    {
        res.status(500).send("Internal Server Error");
    }





})




main()
.then(()=>{

    console.log("Database Connected");
    app.listen(process.env.PORT,()=>{

        console.log(`Listening at Port:${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log(error);
    process.exit(1)
});