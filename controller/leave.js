const sequelize=require('../util/database');
const Leave=require('../models/leave');
const Employee=require('../models/employee');

exports.addLeave=async(req,res)=>{

    const t=await sequelize.transaction();
    
    try{

        const id = req.params.id;

        const employee=await Employee.findByPk(id);

        const leave=await employee.createLeave({
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            description:req.body.description
        },{transaction:t});

        // console.log(leave);

        await t.commit();

        res.status(201).json({
            message: 'Leave added successfully',
            status: 'success',
            leave: leave
        });


    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}


exports.getLeave=async(req,res)=>{

    try {

        const id = req.params.id;

        const employee=await Employee.findByPk(id);

        const leave=await employee.getLeaves();
        
        res.status(200).json({data:leave});
        // res.status(200).json({data:'leave'});
    }
    catch (err) {
        // await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}



exports.deleteLeave=async(req,res)=>{

    const t= await sequelize.transaction();

    try {

        const id = req.params.id;

        const leave=await Leave.findByPk(id);

        leave.destroy();

        await t.commit();


        res.status(201).json({
            message: 'Leave deleted successfully',
            status: 'success',
            leave: leave
        });


    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}