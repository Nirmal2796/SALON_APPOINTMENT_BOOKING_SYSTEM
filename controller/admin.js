const bcrypt = require('bcrypt');


const Admin = require('../models/admin');
const JWTServices=require('../services/JWTservices');
const sequelize = require('../util/database');


exports.postLoginAdmin = async (req, res) => {

    try{
        const email = req.body.email;
        const password = req.body.password;
    
        const admin = await Admin.findAll({where:{email}});

        console.log(email,password,admin);
    
        if (admin.length>0) {

            
            bcrypt.compare(password,admin[0].password,(err,result)=>{

                if(err){
                    throw new Error('Something Went Wrong');
                }
                if(result){
                    res.status(200).json({ message: 'Admin logged in Successfully' , token: JWTServices.generateToken(admin[0].id) });
                }
                else{
                    res.status(401).json({ message: ' Admin not authorized' });
                }
            })
           
        }
        else {
            res.status(404).json({ message: 'admin not found'});
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err });
    }

};


