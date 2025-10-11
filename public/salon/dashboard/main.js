

const profile_menu_list = document.getElementById('profile_menu_list');

const appointment_table_body = document.getElementById('appointment-table-body');

const service_table_body = document.getElementById('service-table-body');


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

//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);

        // Listen for appointment reschedule notifications
        socket.on('appointment_rescheduled', ( appointmentId ) => {
            console.log(`Appointment ${appointmentId} was rescheduled`);
            // You can also update your UI here, like show a toast or notification
        });

        showAppointments();
        showServices();
        showReviews();
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



async function showAppointments() {
    try {

        const token = localStorage.getItem('token');

        console.log('in show appointments');

        const result = await axios.get('http://localhost:3000/get-some-appointments', { headers: { 'Auth': token } });

        console.log(result);

        const appointments = result.data.appointments

        appointments.forEach(appointment => {
            const newRow = `<tr id=${appointment.id}>
                    <td>${new Date(appointment.date).toLocaleDateString("en-GB")}</</td>
                    <td>${appointment.serviceId.name}</td>
                    <td>${appointment.employeeId ? appointment.employeeId.name : '-'}</td>
                </tr>`

            appointment_table_body.innerHTML += newRow;
        });

    } catch (error) {
        console.log(error);
    }
}

async function showServices() {
    try {

        const token = localStorage.getItem('token');

        const result = await axios.get('http://localhost:3000/get-some-services', { headers: { 'Auth': token } });

        console.log(result);

        const services = result.data.services

        services.forEach(s => {
            const newRow = `<tr id=${s.id}>
                    <td>${s.service.name}</td>
                    <td>${s.service.description}</td>
                    <td>${s.specialization.name}</td>
                    <td>${s.service.duration}</td>
                    <td>${s.service.price}</td>
                </tr>`

            service_table_body.innerHTML += newRow;
        });


    } catch (error) {
        console.log(error);
    }
}

async function showReviews() {
    try {

        const token = localStorage.getItem('token');

        const result = await axios.get('http://localhost:3000/get-total-reviews', { headers: { 'Auth': token } });

        console.log(result);

        const total = result.data.total;
        const avg = result.data.avg;

        document.getElementById("average-rating").textContent = avg.toFixed(1);
        document.getElementById("stars").innerHTML = getStars(avg);
        document.getElementById("total-reviews").textContent = total;


    } catch (error) {
        console.log(error);
    }
}

function getStars(rating, maxStars = 5) {
    let starsHTML = "";
    for (let i = 1; i <= maxStars; i++) {
        if (i <= Math.floor(rating)) {
            starsHTML += `<i class="fas fa-star" style="color: gold;"></i>`;  // full
        } else if (i === Math.floor(rating) + 1 && rating % 1 !== 0) {
            starsHTML += `<i class="fas fa-star-half-alt" style="color: gold;"></i>`; // half
        } else {
            starsHTML += `<i class="far fa-star" style="color: gold;"></i>`;  // empty
        }
    }
    return starsHTML;
}