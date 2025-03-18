const path=require('path');
const fs=require('fs');

const express = require('express');

const cors=require('cors');
const helemt=require('helmet');
const morgan=require('morgan');

const cron = require("cron");

require('dotenv').config(); 

const app=express();

const bodyParser=require('body-parser');

const sequelize=require('./util/database');


const User=require('./models/user');
const ForgotPasswordRequests=require('./models/forgotPasswordRequests');
const Salon=require('./models/salon');
const Service=require('./models/service');
const Working_Hours=require('./models/working_hours');
const Closed_Period=require('./models/closed_period');
const Employee=require('./models/employee');
const Specialization=require('./models/specialization');
const Employee_Specialization=require('./models/employee_specialization');
const Leave=require('./models/leave');
const RegularShift=require('./models/regular_shift');
const Payment=require('./models/payment');
const Appointment=require('./models/appointment');


const userRouter=require('./routes/user');
const passwordRouter=require('./routes/password');
const salonRouter=require('./routes/salon');
const serviceRouter=require('./routes/service');
const workingHoursRouter=require('./routes/working-hours');
const closedPeriodRouter=require('./routes/closed-period');
const employeeRouter=require('./routes/employee');
const leaveRouter = require('./routes/leave');
const userSalonRouter=require('./routes/user_salon');
const regularShiftRouter=require('./routes/regular_shift');
const paymentRouter=require('./routes/payment');
const appointmentRouter=require('./routes/appointment');

const accessLogStream=fs.createWriteStream(path.join(__dirname, 'access.log'),{flags:'a'})

app.use(helemt({ contentSecurityPolicy: false }));
app.use(morgan('combined',{stream:accessLogStream}));


app.use(cors());

//express.static() is a function that takes a path, and returns a middleware that serves all files in that path.
app.use(express.static(path.join(__dirname, 'public')));

//option {extended:false} configures the middleware to use the classic encoding algorithm
app.use(bodyParser.json({extended:false}));




app.use(userRouter);
app.use(passwordRouter);
app.use(salonRouter);
app.use(serviceRouter);
app.use(workingHoursRouter);
app.use(closedPeriodRouter);
app.use(employeeRouter);
app.use(leaveRouter);
app.use(userSalonRouter);
app.use(regularShiftRouter);
app.use(paymentRouter);
app.use(appointmentRouter);

// app.use((req,res) => {
    // console.log("URL>>>",req.url);
    // res.sendFile(path.join(__dirname, `public/${req.url}`));
// });



User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

User.hasMany(Payment);
Payment.belongsTo(User);

Salon.hasMany(Service);
Service.belongsTo(Salon);

Salon.hasMany(Working_Hours);
Working_Hours.belongsTo(Salon);

Salon.hasMany(Closed_Period);
Closed_Period.belongsTo(Salon);

Salon.hasMany(RegularShift);
RegularShift.belongsTo(Salon);

Salon.hasMany(Employee);
Employee.belongsTo(Salon);

Employee.belongsToMany(Specialization,{through:Employee_Specialization});
Specialization.belongsToMany(Employee,{through:Employee_Specialization});

Employee.hasMany(Leave);
Leave.belongsTo(Employee);

Specialization.hasMany(Service);
Service.belongsTo(Specialization);

Appointment.belongsTo(User);  // One user can have multiple appointments
User.hasMany(Appointment);

Appointment.belongsTo(Service);  // Each appointment is for one service
Service.hasMany(Appointment);

Appointment.belongsTo(Salon);  // Each appointment is at one salon
Salon.hasMany(Appointment);

Appointment.belongsTo(Employee);
Employee.hasMany(Appointment);



// Run every day at midnight
const job = new cron.CronJob('0 0 * * *', async () => {

    const t = await sequelize.transaction();
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0); 

        await Closed_Period.destroy({
          where: {
            end_date: {
              [Op.lte]: yesterday, // Delete records where end_date is yesterday or earlier
            },
          },
          transaction:t
        });


        await t.commit();
    
        console.log("Expired records deleted successfully.");
      } catch (error) {
        await t.rollback();
        console.error("Error deleting expired records:", error);
      }
},
null, // This function is executed when the job stops
true, // Start the job right now
'Asia/Kolkata' // Time zone of this job.
);




sequelize
.sync()
// .sync({force:true})
// .sync({alter:true})
.then(result=>{
    app.listen(3000);
})
.catch(err=>console.log(err));