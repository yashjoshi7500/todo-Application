const mongoose= require("mongoose");
const {Schema} = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema= new Schema({

    firstName:{
        type:String,
        minLength:[3,"Minimum Lenght should be 3"],
        trim:true
    },
    
    lastName:{
        type:String,
        trim:true

    },

    emailId:{
        type:String,
        unique:true
    },

    password:{

        type:String
    },

    userRole:{
        type:String,
        trim:true,
        maxLength:[20,"Describe your role in 20 characters Max"]
    }

},{timestamps:true});

const taskSchema = new Schema({

    title:{
        type:String,
        maxLenght:[30,"Describe your tasks title within 30 characters Max"]

    },

    completed:{
        type:Boolean,
        default:false
    },

    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});



userSchema.methods.getJWT = function(){

    const result = jwt.sign({_id:this._id,emailId:this.emailId},process.env.SECRET_KEY,{expiresIn:1800});
    return result;
    //here this refers to the current object who is calling the function 

}

userSchema.methods.verifyPassword = async function(userPassword){

    const result = await bcrypt.compare(userPassword,this.password);
    return result;
}


const User = mongoose.model("User",userSchema);

const Task = mongoose.model("task",taskSchema);

module.exports = {User,Task};