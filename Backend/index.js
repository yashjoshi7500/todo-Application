const express = require("express");
const main = require("./database");
const validateUser = require("./api_validate/validateUser");
const validateTask= require("./api_validate/validateTask");
const bcrypt = require("bcrypt");
const {User,Task} = require("./Models/tasks");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require('dotenv').config();


const app = express();

app.use(express.json());


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


app.post("/tasks",async(req,res)=>{

    try
    {
    validateTask(req.body);

    await Task.create(req.body);
    res.status(201).send("Task Created Successfully");

    }
    catch(error)
    {
        res.status(400).send("Error Detected:"+error.message);
    }



})

app.get("/tasks/:id",async(req,res)=>{

    try
    {
        
    console.log(req.params.id);
    const ans = await Task.findOne({userId:req.params.id});
    res.send(ans);
    }
    catch(error)
    {
        res.status(500).send("Internal Server Error");
    }
})


app.patch("/tasks",async(req,res)=>{

    try
    {
    const result = await Task.updateOne(
    {userId:req.body.userId},
    {$set:{completed:req.body.completed}}
    );

    console.log(result);
    res.send("Updated Successfully");
    }
    catch(error)
    {
        res.send(500).status("Internal Server Error");
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

    const isPasswordCorrect = await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect)
        return res.status(401).send("Invalid Email or Password");

    const jwtToken=jwt.sign({_id:user._id,emailId:user.emailId},process.env.SECRET_KEY,{expiresIn:1800});
    

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