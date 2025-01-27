const sequelize=require('../util/database');
const Salon=require('../models/salon');

exports.addWorkingHours=async(req,res)=>{

    const t=sequelize.transaction();
    try{

        const data=req.body;

        
        Object.keys(data).forEach(async(d) => {
            console.log(d);
           await req.user.createWorking_hour({
                day:d,
                start_time:data[d].start_time,
                end_time:data[d].end_time
            });
        });


        // console.log('data',data);
        res.status(200).json({message:'working hours set successfully', data:data});
    }
    catch (err) {
        // await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}