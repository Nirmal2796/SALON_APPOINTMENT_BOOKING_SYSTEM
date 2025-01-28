const sequelize=require('../util/database');
const Closed_Period=require('../models/closed_period');

exports.addClosedPeriod=async(req,res)=>{

    const t=await sequelize.transaction();
    
    try{

        const closed_period=await req.user.createClosed_period({
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            description:req.body.description
        },{transaction:t});


        await t.commit();

        res.status(201).json({
            message: 'Closed period added successfully',
            status: 'success',
            closed_period: closed_period
        });


    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}


exports.getClosedPeriod=async(req,res)=>{

    try {

        const closed_period=await req.user.getClosed_periods();
        
        res.status(200).json({data:closed_period});
    }
    catch (err) {
        // await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}



exports.deleteClosedPeriod=async(req,res)=>{

    const t= await sequelize.transaction();

    try {

        const id = req.params.id;

        const closed_period=await Closed_Period.findByPk(id);

        closed_period.destroy();

        await t.commit();


        res.status(201).json({
            message: 'Closed period deleted successfully',
            status: 'success',
            closed_period: closed_period
        });


    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}