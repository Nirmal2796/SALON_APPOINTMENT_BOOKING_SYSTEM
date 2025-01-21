
const Service=require('../models/service');
const sequelize=require('../util/database');


exports.getServices=async(req,res)=>{
    try{
            const services=await req.user.getServices();

            res.status(200).json({ services: services });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}


exports.addService=async(req,res)=>{

    const t=await sequelize.transaction();

    try{

           
            const service=await req.user.createService({
                name:req.body.name,
                description:req.body.description,
                duration:req.body.duration,
                price:req.body.price

            },{transaction:t});


            await t.commit();

            res.status(201).json({
                message: 'Service added successfully',
                status: 'success',
                service: service
            });


    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }

}

exports.getServiceDetails=async(req,res)=>{
    try{
            const service=await Service.findByPk(req.params.id);

            res.status(200).json({ service: service });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

exports.editService=async(req,res)=>{
    
    const t=await sequelize.transaction();

    try{

        const service=await Service.findByPk(req.params.id);

        const newService=await service.update({
                name:req.body.name,
                description:req.body.description,
                duration:req.body.duration,
                price:req.body.price
        },{transaction:t})

           
            await t.commit();

            res.status(201).json({
                message: 'Service updated successfully',
                status: 'success',
                service: newService
            });
        }
        catch (err) {
            await t.rollback();
            console.log(err);
            res.status(500).json({ success: false, message: 'Something went wrong' });
        }
}

exports.deleteService=async(req,res)=>{
    const t= await sequelize.transaction();

    try {

        const id = req.params.id;

        const service=await Service.findByPk(id);

        service.destroy();

        await t.commit();

        res.status(200).json({message:'service deleted successfully', service:service});

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false});
    }
}