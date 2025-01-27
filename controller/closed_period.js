const sequelize=require('../util/database');

exports.addClosedPeriod=async(req,res)=>{

    try{

    }
    catch (err) {
        // await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}