const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Salon = require('../models/salon');

exports.authentication = async (socket,next) => {

    try {

        const token = socket.handshake.auth.token;
        const role = socket.handshake.auth.role;

        if (!token) {
            const err = new Error('Authentication error: Token missing');
            return next(err);
        }

        console.log("Token>>>>>>",token);
        const decrypted_user = jwt.verify(token, process.env.TOKEN_SECRET);

        let user;
        console.log(decrypted_user,'////////////////////////////////');
        if(role=='user'){

             user = await User.findByPk(decrypted_user.userId);
            console.log(decrypted_user,'user');

        }
        else if(role=='salon'){
            user= await Salon.findByPk(decrypted_user.userId);
            console.log(decrypted_user,'salon');
        }
        // console.log(user);
        if (user) {
            
        // Attach user data to the socket object for future use
            socket.user = user;
            next(); // Allow connection
        }
        else {

            throw new Error('User not found');
            return next(err);
        }

    }
    catch (err) {
        console.error('Authentication failed:', err.message);
        next(new Error('Authentication error: Invalid token'));
    }
}
