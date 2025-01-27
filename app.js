const path=require('path');
const fs=require('fs');

const express = require('express');

const cors=require('cors');
const helemt=require('helmet');
const morgan=require('morgan');

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


const userRouter=require('./routes/user');
const passwordRouter=require('./routes/password');
const salonRouter=require('./routes/salon');
const serviceRouter=require('./routes/service');
const workingHoursRouter=require('./routes/working-hours');
const closedPeriodRouter=require('./routes/closed-period');


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

// app.use((req,res) => {
    // console.log("URL>>>",req.url);
    // res.sendFile(path.join(__dirname, `public/${req.url}`));
// });



User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

Salon.hasMany(Service);
Service.belongsTo(Salon);

Salon.hasMany(Working_Hours);
Working_Hours.belongsTo(Salon);

Salon.hasMany(Closed_Period);
Closed_Period.belongsTo(Salon);


sequelize
.sync()
// .sync({force:true})
// .sync({alter:true})
.then(result=>{
    app.listen(3000);
})
.catch(err=>console.log(err));