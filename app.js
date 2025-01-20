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


const userRouter=require('./routes/user');
const passwordRouter=require('./routes/password');



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

// app.use((req,res) => {
    // console.log("URL>>>",req.url);
    // res.sendFile(path.join(__dirname, `public/${req.url}`));
// });



User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);


sequelize
.sync()
// .sync({force:true})
.then(result=>{
    app.listen(3000);
})
.catch(err=>console.log(err));