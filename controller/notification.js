const sequelize=require('../util/database');

const Notification=require('../models/notification');
const Salon = require('../models/salon');
const User=require('../models/user');

exports.getNotification = async (req, res) => {

    try {

        const Notificaitons=await req.user.getNotificaitons({
            where:{seen:false}
        });

        // const a= Salon.associations;
        // console.log(a);
        // console.log(a.accessors);
// const associations = Salon.associations; 
// for (let associationName in a) {
//   const association = a[associationName];
//   console.log(`Association: ${associationName}`);
//   console.log(`Methods:`, association.accessors); 
// }
       
        return res.status(201).json({notificaiton:Notificaitons});
        
    }
    catch (err) {
        
        res.status(500).json({ success: false, message: 'Something went wrong' ,err:err});

    }
}


exports.sendNotification= async (req, res) => {

    const t=await sequelize.transaction();

    try {

        const notificaiton=await req.user.createNotificaiton({
            message:req.body.message,
            seen:false,
            salonId:req.body.salonId
        },
        {transaction:t});
    

        //  const a= User.associations;
        // console.log(a);
        // console.log(a.accessors);
// const associations = Salon.associations; 
// for (let associationName in a) {
//   const association = a[associationName];
//   console.log(`Association: ${associationName}`);
//   console.log(`Methods:`, association.accessors); 
// }
        await t.commit();
        res.status(202).json({ success: true, notificaiton:notificaiton});

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });

    }

}

exports.updateNotification= async (req, res) => {

    const t=await sequelize.transaction();

    try {

        const notifications=req.body.notifications;

        console.log(notifications);

        for(n in notifications){

            const notificaiton =await Notification.findByPk(notifications[n].id);
        
            await notificaiton.update({seen:true},{transaction:t});
        }
        
        await t.commit();
        res.status(202).json({ success: true, });

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });

    }

}