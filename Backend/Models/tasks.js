const mongoose= require("mongoose");
const {Schema} = mongoose;
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


const User = mongoose.model("User",userSchema);

const Task = mongoose.model("task",taskSchema);

module.exports = {User,Task};