const Salon = require('../models/salon');
const Working_hours=require('../models/working_hours')
const sequelize=require('../util/database');

exports.addWorkingHours=async(req,res)=>{

    const t=await sequelize.transaction();
    try{

        const data=req.body;

        for(const d of Object.keys(data)){
        // Object.keys(data).forEach(async(d) => { //never use for each for async operations.
            console.log(d);

            const[working_hour,created]=await Working_hours.findOrCreate({
                where:{
                    day:d,
                    salonId:req.user.id
                },
                defaults:{
                    day:d,
                start_time:data[d].start_time,
                end_time:data[d].end_time,
                salonId:req.user.id
                },
                transaction:t
            });

            if (!created) {
                await working_hour.update(
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
        res.status(200).json({message:'working hours set successfully', data:data});
    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}

exports.getWorkingHours=async(req,res)=>{

    // const t=sequelize.transaction();
    try{
        const userId = req.params.id || req.user.id;
        const user = await Salon.findByPk(userId);

        console.log(user)
        const working_hours=await user.getWorking_hours();

        // console.log(working_hours);

//to get magicalmethods name
//         const associations = Salon.associations; 
// for (const associationName in associations) {
//   const association = associations[associationName];
//   console.log(`Association: ${associationName}`);
//   console.log(`Methods:`, association.accessors); 
// }
// 
        // console.log('data',data);
        res.status(200).json({data:working_hours});
    }
    catch (err) {
        // await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}