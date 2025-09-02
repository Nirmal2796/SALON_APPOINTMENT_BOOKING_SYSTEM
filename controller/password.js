const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const path = require('path');

const sequelize = require('../util/database');

const User = require('../models/user');
const ForgotPasswordRequests = require('../models/forgotPasswordRequests');

 //unique identifier just like id but it is normally a long string so that other people cannot guess
const { v4: uuidv4 } = require('uuid'); 

//require('dotenv').config();


exports.forgotPassword = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const email = req.body.email;

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

        const tranEmailApi = new Sib.TransactionalEmailsApi(); // transactional email api when we need to send some confirmation or reset . and another is EmailCampaign is used when we have a newsletter or something like that.

        const uid = uuidv4();

        const user = await User.findOne({ where: { email } });

        if (user) {

            await user.createForgotpasswordrequest({
                id: uid,
                isActive: true
            }, { transaction: t })

            const sender = {
                email: 'nirmalgadekar2796@gmail.com',
                name: 'SALON APPOINTMENT'
            }

            const receivers = [
                {
                    email: email
                }
            ]

            // console.log(receivers[0]);
             

            const response = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset Password',
                textContent: `http://52.54.180.45:3000/resetpassword/{{params.uid}}`,
                params: {
                    uid: uid
                }
            })

            await t.commit();

            res.status(200).json({success: true});


        }
        else {
            res.status(404).json({ message: 'User not found'});
        }
        
        
        // console.log(response);

    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }

}


exports.resetPassword = async (req, res) => {

    try {
        const uid = req.params.uid;

        const request = await ForgotPasswordRequests.findByPk(uid);

        if (request && request.isActive) {

            await request.update({ isActive: false });

            res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            
            res.status(200).send(`<html lang="en">

                                                <head>
                                                    <meta charset="UTF-8">
                                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                    <link rel="stylesheet" href="./css/input.css">
                                                    <script src="https://cdn.tailwindcss.com"></script>
                                                    <title>Reset Password</title>
                                                </head>

                                                <body>


                                                    <header class="bg-[#154e49] py-2">
                                                        <nav class="w-[95%] mx-auto">
                                                            <div class="">
                                                                <h2 class="lg:text-4xl text-2xl font-bold text-white">Reset Password</h2> 
                                                            </div>
                                                        </nav>
                                                    </header>

                                                    <main>
                                                        <div class="flex flex-col justify-center items-center">
                                                            
                                                            <form action="/updatepassword/${uid}" method="get" id="reset-form" class="mt-5">
                                                                
                                                                <div class="relative mt-5 mx-2 text-red-500" id="forgot-msg"></div>
                                                                <!-- //get method so password will go in key value pair in url after question mark eg. /password/updatepassword/uid?password=123; 
                                                                //and it can be accessed using query.
                                                                //uid will be accessed using params as it is dyanmic url or route. a part of url after '/' eg. /password/updatepassword/uid -->
                                                                

                                                                <div id="input-field" class="relative w-full max-w-96 my-3 mx-0 h-14 grid py-0 px-2">

                                                                    <input type="password" name="password" id="password" placeholder=" "
                                                                        class="block py-2.5 px-0 appearance-none text-base text-gray-900 bg-transparent border-0 border-b-2 border-[#7db3ae]  focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                                                                    <label for="password"
                                                                        class="absolute text-[#7db3ae]  font-bold  duration-300 transform -translate-y-6 scale-75 top-5  origin-[0]  left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:font-semibold">New Password</label>

                                                                </div>
                                                    
                                                                <button type="submit" id="log-in-btn"
                                                                    class="w-fit bg-[#154e49]  py-3 px-10 my-3 rounded-full text-white font-bold">Submit</button>

                                                            </form>
                                                        </div>
                                                    </main>

                                                    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js"></script>
                                                    <script>


                                                    </script>

                                                </body>

                                                </html>`);

            res.end();

        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: err });
    }

}


exports.updatePassword = async (req, res) => {

    const t = await sequelize.transaction();
    try {

        const uid = req.params.uid;           //eg. /password/updatepassword/uid
        const newPassword = req.query.password;  //eg. /password/updatepassword/uid?password=123;

        // console.log("NEWPASSWORD == ",newPassword)

        const forgot_password_request = await ForgotPasswordRequests.findByPk(uid);
        // console.log(request)
        const user = await User.findByPk(forgot_password_request.userId);

        // console.log(user);

        bcrypt.hash(newPassword, 10, async (err, hash) => {
            await user.update({ password: hash }, { transaction: t });

            // console.log(up);
            // alert('Password updated Successfully');
            // res.redirect('/login');

            await t.commit();
            res.status(200).json({ success: true, message: 'Password updated Successfully' });
        })
    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: err });
    }

}