

const profile_menu_list = document.getElementById('profile_menu_list');

const NotificationDiv=document.getElementById('notifications_div');


//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//TOKEN
const token = localStorage.getItem('token');


var socket = io("http://localhost:3000", {
    auth: {
        token: token, // Send the token during the handshake
        role: "salon"
    }
});


//RECEIVE MESSAGE
socket.on('appointment_rescheduled', (message) => {
    // chat_box.innerHTML = '';
    // console.log(message);
    showNotification(message);
})


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);

        // Listen for appointment reschedule notifications
        // socket.on('appointment_rescheduled', ( appointmentId ) => {
        //     console.log(`Appointment ${appointmentId} was rescheduled`);
        //     // You can also update your UI here, like show a toast or notification
        // });

        await getNewNotifications();


    }
    catch (err) {
        console.log(err);
    }
}




//CHANGE PROFILE MENU
async function changeProfileMenu() {
    try {
        const token = localStorage.getItem('token');

        const res = await axios.get('http://localhost:3000/salon-validate-token', { headers: { 'Auth': token } });

        // const status='false';
        // console.log(profile_menu_list);

        if (res.data.status === 'success') {
            profile_menu_list.innerHTML = `
            <li><a href="../edit-profile/edit-profile.html">Edit Profile</a></li>
            `;
        }
        else {
            profile_menu_list.innerHTML = `
            <li><a href="../login/login.html">Login</a></li>`;
        }
    }
    catch (err) {
        console.log(err);
    }
}



//TOGGLE PROFILE MENU
function toggleProfileMenu() {
    var profileMenu = document.getElementById("profile_menu");
    profileMenu.classList.toggle("show");
}

//TOGGLE MENU
function toggleMenu() {
    var Menu = document.getElementById("nav-list");
    Menu.classList.toggle("show");
}


async function getNewNotifications() {
    
    try {
        const token =localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/get-notifications`, { headers: { 'Auth': token } });
        console.log(res);

        const notifications=res.data.notificaiton;

        for(let n in notifications){
            // console.log(notifications[n].message);
            showNotification(notifications[n].message);
        }

        await axios.put(`http://localhost:3000/update-seen-notification`,{notifications} ,{ headers: { 'Auth': token } });
        
    } catch (error) {
        console.log(error);
    }
}

function showNotification(message){

   const newMessage = `<p>${message}</p>`;
    
    NotificationDiv.innerHTML += newMessage;
}