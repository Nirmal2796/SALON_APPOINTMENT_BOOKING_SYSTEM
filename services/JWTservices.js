const jwt=require('jsonwebtoken');

const generateToken=(id, ispremiumuser)=>{
    return jwt.sign({userId:id , ispremiumuser:ispremiumuser},process.env.TOKEN_SECRET);
}


module.exports={
    generateToken
};