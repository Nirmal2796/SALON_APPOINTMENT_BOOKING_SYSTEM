
const Regular_Shift = require('../models/regular_shift');
const sequelize=require('../util/database');

exports.addRegularShift=async(req,res)=>{

    const t=await sequelize.transaction();
    try{

        const data=req.body;

        for(const d of Object.keys(data)){
        // Object.keys(data).forEach(async(d) => { //never use for each for async operations.
            console.log(d);

            const[regular_shift,created]=await Regular_Shift.findOrCreate({
                where:{
                    day:d,
                    salonId:req.user.id
                },
                defaults:{
                    day:d,
                start_time:data[d].start_time,
                end_time:data[d].end_time
                },
                transaction:t
            });

            if (!created) {
                await regular_shift.update(
                    {
                        start_time: data[d].start_time,
                        end_time: data[d].end_time
                    },
                    { transaction: t } 
                );
            }
        
        };

        await t.commit();

        // console.log('data',data);
        res.status(200).json({message:'regular shift set successfully', data:data});
    }
    catch (err) {
        // await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}

exports.getRegularShifts=async(req,res)=>{

    // const t=sequelize.transaction();
    try{

        const regular_shifts=await req.user.getRegular_shift();


        // console.log('data',data);
        res.status(200).json({data:regular_shifts});
    }
    catch (err) {
        // await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}