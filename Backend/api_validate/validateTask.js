
const mongoose = require("mongoose");

function validateTask(data)
{


    const mandatoryField=["title","userId"];
    const result = mandatoryField.every(value=>Object.keys(data).includes(value));

     if(!result)
        throw new Error("All Fields are required");

     if(typeof data.title!=="string"||data.title.trim()=="")
        throw new Error("Enter a valid Task");


     if (data.completed !== undefined &&typeof data.completed !== "boolean") 
        throw new Error("Completed must be a Boolean");

     
    if (!mongoose.isValidObjectId(data.userId)) 
        throw new Error("Invalid User ID");

}

module.exports = validateTask;