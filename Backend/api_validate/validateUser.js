const validator = require("validator");


function validateUser(data)
{
    if (data === null ||typeof data !== "object" ||Array.isArray(data))
    {
    
        // Array.isArray(data) it check whether the given data is array or not
        throw new Error("Request data must be a valid object");
    }

    
    const mandatoryField=["firstName","emailId","password","userRole"];
    const result = mandatoryField.every(value=>Object.keys(data).includes(value));

    if(!result)
        throw new Error("All Fields are required");

    if(typeof data.password!=="string"||!validator.isStrongPassword(data.password))
    {
        throw new Error("Please Enter a Strong Password");
    }

     if(typeof data.emailId!=="string"||!validator.isEmail(data.emailId))
    {
        throw new Error("Please Enter a Valid EmailId");
    }


    if(typeof data.userRole!=="string"||data.userRole.trim()=="")
        throw new Error("Enter your Role");


    // if(typeof data.title!=="string"||data.title.trim()=="")
    //     throw new Error("Enter a valid Task");


    if(typeof data.firstName!=="string"||data.firstName.trim()=="")
        throw new Error("Enters Characters only and do not blank the Name field");

    if(data.firstName.length<3||data.firstName.length>10)
        throw new Error("Minimum lenght of characters should be 3 and Maximum lenght ofcharacters should be 10");


    
}

// const obj={

//     password:"Y@shjoshi123",
//     title:"I am node js",
//     firstName:"ch",
//     emailId:"yashjoshi@gmail.com",
//     userRole:"Developer"
// }

// validateUser(obj);

module.exports = validateUser;