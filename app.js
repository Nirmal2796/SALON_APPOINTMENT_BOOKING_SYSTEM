const path = require('path');
const fs = require('fs');
const http = require('http');

const express = require('express');

const cors = require('cors');
const helemt = require('helmet');
const morgan = require('morgan');


require('dotenv').config();

const app = express();

const server = http.createServer(app); // Create HTTP server
const io = require('socket.io')(server); // Attach socket.io to the server instance


const bodyParser = require('body-parser');

const sequelize = require('./util/database');


//MODELS
const User = require('./models/user');
const ForgotPasswordRequests = require('./models/forgotPasswordRequests');
const Salon = require('./models/salon');
const Service = require('./models/service');
const Working_Hours = require('./models/working_hours');
const Closed_Period = require('./models/closed_period');
const Employee = require('./models/employee');
const Specialization = require('./models/specialization');
const Employee_Specialization = require('./models/employee_specialization');
const Leave = require('./models/leave');
const RegularShift = require('./models/regular_shift');
const Payment = require('./models/payment');
const Appointment = require('./models/appointment');
const Review=require('./models/review');
const Admin=require('./models/admin');

//ROUTES
const userRouter = require('./routes/user');
const passwordRouter = require('./routes/password');
const salonRouter = require('./routes/salon');
const serviceRouter = require('./routes/service');
const workingHoursRouter = require('./routes/working-hours');
const closedPeriodRouter = require('./routes/closed-period');
const employeeRouter = require('./routes/employee');
const leaveRouter = require('./routes/leave');
const userSalonRouter = require('./routes/user_salon');
const regularShiftRouter = require('./routes/regular_shift');
const paymentRouter = require('./routes/payment');
const appointmentRouter = require('./routes/appointment');
const reviewRouter=require('./routes/review');
const adminRouter=require('./routes/admin');

//IMPORT SOCKET AUTHENTICATION MIDDLEWARE
const socketAuthMiddleware = require('./middleware/socketUserAuthentication');

//import appointment reminder cron job and start it.
require('./jobs/appointmentReminderCron');

//import delete closedperiod cron job and start it.
require('./jobs/deleteExpiredClosedPeriodsCron');

//TO WRITE IN ACCESS LOG
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


app.use(helemt({ contentSecurityPolicy: false })); //adds security headers
app.use(morgan('combined', { stream: accessLogStream })); //logs all requests


app.use(cors()); //allows your server to accept requests from other origins.

//express.static() is a function that takes a path, and returns a middleware that serves all files in that path.
app.use(express.static(path.join(__dirname, 'public')));

//option {extended:false} configures the middleware to use the classic encoding algorithm
app.use(bodyParser.json({ extended: false }));




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
app.use(reviewRouter);
app.use(adminRouter);


//SOCKET AUTHENTICATION MIDDLEWARE
io.use(socketAuthMiddleware.authentication);

//SOCKET IO CONNECTION 
io.on('connection', socket => {

    console.log('SCOKET ID:::::',socket.id);
  // When user reschedules
  socket.on('reschedule_appointment', ( salonId, appointmentId ) => {
    // Send message to the salon room
    console.log('appointment recheduled ..................................',salonId,appointmentId);
    io.to(`${salonId}`).emit('appointment_rescheduled', appointmentId);
  });

  console.log(socket.handshake.auth.role,' ..................................');

  if(socket.handshake.auth.role === 'salon') {
    socket.join(`${socket.user.id}`);
    console.log(`Salon joined room: ${socket.user.id}`);
  }


  socket.on('join-room', (salonId) => {
    socket.join(`${salonId}`);
    console.log(`User joined room: ${salonId}`);
  });
  
    //ON DISCONNECT
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


//MODEL ASSOCIATIONS (RELATIONS)
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

Salon.hasMany(Review);
Review.belongsTo(Salon);

Salon.hasMany(Employee);
Employee.belongsTo(Salon);

Employee.belongsToMany(Specialization, { through: Employee_Specialization });
Specialization.belongsToMany(Employee, { through: Employee_Specialization });

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

Appointment.belongsTo(Payment);     // many appointments → one payment
Payment.hasMany(Appointment);



sequelize
  .sync()
  // .sync({force:true})
  // .sync({alter:true})
  .then(result => {
    server.listen(3000);
//     app.listen(3000, "0.0.0.0", () => {
//   console.log("Server running on port 3000");
// });
  })
  .catch(err => console.log(err));