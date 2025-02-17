
const Service=require('../models/service');
const sequelize=require('../util/database');
const Specialization=require('../models/specialization');


exports.getServices=async(req,res)=>{
    try{
            const services=await req.user.getServices();

            for(let s in services){

                const specialization = await Specialization.findByPk(services[s].specializationId);

                const service=services[s];

                services[s]={service , specialization};

            }

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

        const specialization=req.body.specialization;

        const found_specialization =await Specialization.findAll({
            where:{
                name:specialization
            }
        });
           
            const service=await req.user.createService({
                name:req.body.name,
                description:req.body.description,
                duration:req.body.duration,
                price:req.body.price,
                specializationId:found_specialization[0].id

            },{transaction:t});


            await t.commit();

            res.status(201).json({
                message: 'Service added successfully',
                status: 'success',
                service: {service, specialization:found_specialization}
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

            console.log(service);

            const specialization=await Specialization.findByPk(service.specializationId);

            res.status(200).json({ service: {service, specialization} });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

exports.editService=async(req,res)=>{
    
    const t=await sequelize.transaction();

    try{

        const specialization=req.body.specialization;

        const found_specialization =await Specialization.findAll({
            where:{
                name:specialization
            }
        });

        const service=await Service.findByPk(req.params.id);

        const newService=await service.update({
                name:req.body.name,
                description:req.body.description,
                duration:req.body.duration,
                price:req.body.price,
                specializationId:found_specialization[0].id
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