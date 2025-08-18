const sign_up_user_name = document.getElementById('sign_up_name');
const sign_up_user_email = document.getElementById('sign_up_email');
// const sign_up_user_phone = document.getElementById('sign_up_phone');
const sign_up_user_password = document.getElementById('sign_up_password');
const sign_up_msg = document.getElementById('sign_up_msg');
const sign_up_error = document.getElementById('sign_up_error');

const login_user_email = document.getElementById('login_email');
const login_user_password = document.getElementById('login_password');
const login_msg = document.getElementById('login_msg');
const login_error = document.getElementById('login_error');



const forgot_email = document.getElementById('forgot_password_email');
const forgot_msg = document.getElementById('forgot_password_msg');


const sign_up_form = document.getElementById('sign_up_form');
const login_form = document.getElementById('login_form');
const forgot_form = document.getElementById('forgot_password_form');

const sign_up_submit = document.getElementById('sign_up_submit');
const login_submit = document.getElementById('login_submit');

sign_up_form.addEventListener('submit', onSignUp);
login_form.addEventListener('submit', onLogin);
forgot_form.addEventListener('submit', forgotPassword);

let role = 'user';

function ShowSignup() {
    document.getElementById('sign_up_div').hidden = false;
    document.getElementById('login_div').hidden = true;
    document.getElementById('forgot_password_div').hidden = true;
}

function ShowLogin() {
    document.getElementById('login_div').hidden = false;
    document.getElementById('sign_up_div').hidden = true;
    document.getElementById('forgot_password_div').hidden = true;
}

function ShowForgotPassword() {
    document.getElementById('login_div').hidden = true;
    document.getElementById('forgot_password_div').hidden = false;
}


async function onSignUp(e) {

    e.preventDefault();

    if (sign_up_user_name.value == '' || sign_up_user_email.value == '' || sign_up_user_password == '') {
        sign_up_msg.innerHTML = '<b>Please enter all fields</b>';

        setTimeout(() => {
            sign_up_msg.removeChild(sign_up_msg.firstChild);
        }, 2000);
    }
    else {

        try {

            User = {
                name: sign_up_user_name.value,
                email: sign_up_user_email.value,
                password: sign_up_user_password.value
            };

            let result;

            if (role == 'user') {

                result = await axios.post("http://localhost:3000/signup", User);

            }
            else {
                result = await axios.post("http://localhost:3000/bussiness-signup", User);

            }


            alert(result.data.message);

            sign_up_form.reset();
        }
        catch (err) {

            sign_up_form.reset();

            sign_up_msg.innerHTML = `${err.data}`;
            setTimeout(() => {
                sign_up_msg.removeChild(sign_up_msg.firstChild);
            }, 2000);

            console.log(err);
        }
    }

}

async function onLogin(e) {

    e.preventDefault();

    if (login_user_email.value == '' || login_user_password == '') {
        login_msg.innerHTML = '<b>Please enter all fields</b>';

        setTimeout(() => {
            login_msg.removeChild(sign_up_msg.firstChild);
        }, 2000);
    }
    else {

        try {

            User = {
                email: login_user_email.value,
                password: login_user_password.value
            };

            let result;

            if (role == 'user') {

                result = await axios.post(`http://localhost:3000/login`, User);
                localStorage.setItem('isOwner', false);
                window.location.href = '../user/home/home.html';
            }
            else if (role =='bussiness'){
                // console.log(role);
                result = await axios.post(`http://localhost:3000/bussiness-login`, User);
                localStorage.setItem('isOwner', true);
                window.location.href = '../salon/dashboard/dashboard.html';

            }
            // else{
            //     result = await axios.post(`http://localhost:3000/admin-login`, User);
            //     localStorage.setItem('isOwner', true);
            //     // window.location.href = '../salon/dashboard/dashboard.html';
            // }


            localStorage.setItem('token', result.data.token);

            // console.log(localStorage.getItem('token'));

            login_form.reset();
        }
        catch (err) {

            login_form.reset();

            login_msg.innerHTML = `${err.response.data.message}`;
            setTimeout(() => {
                login_msg.removeChild(login_msg.firstChild);
            }, 2000);


            console.log(err);
        }
    }
}




//FORGOT PASSWORD
async function forgotPassword(e) {
    e.preventDefault();

    if (forgot_email.value == '') {

        forgot_msg.innerHTML = '<b>Please enter all fields</b>';

        setTimeout(() => {
            forgot_msg.removeChild(msg.firstChild);
        }, 2000);


    }
    else {
        try {

            const Email = {
                email: forgot_email.value,

            };

            // console.log(Email);

            const result = await axios.post("http://localhost:3000/forgotpassword", Email);

            forgot_form.reset();

            alert('Reset Email sent successfully..Please check Your Mail!!');

        }
        catch (err) {

            // console.log(err)
            forgot_msg.innerHTML = `${err.response.data.message}`;

            setTimeout(() => {
                forgot_msg.removeChild(forgot_msg.firstChild);
            }, 2000);

            // console.log(err.message);
            forgot_form.reset();

        }

    }

}

//role assign
function login_As(r) {

    // console.log(r);

    sign_up_form.reset();
    login_form.reset();

    if (r == 'user') {
        role='user';
        document.getElementById('user-section').hidden = true;
        document.getElementById('bussiness-section').hidden = false;
    }
    else if (r =='bussiness'){
        role='bussiness';
        document.getElementById('user-section').hidden = false;
        document.getElementById('bussiness-section').hidden = true;
    }
    // else{

    // }

    role = r;

}