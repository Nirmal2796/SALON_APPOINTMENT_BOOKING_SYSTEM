
const appointment_table_div=document.getElementById('appointment-table-div');
const appointment_message_div=document.getElementById('appointment-message-div');
const appointment_table_body=document.getElementById('appointment-table-body');

const profile_menu_list = document.getElementById('profile_menu_list');




//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() { 
    try{
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
        await getAppointments();
    }
    catch(err){
        console.log(err);
    } 
}




//CHANGE PROFILE MENU
async function changeProfileMenu() {
    try{
        const token=localStorage.getItem('token');

        const res=await axios.get('http://localhost:3000/validate-token',{ headers: { 'Auth': token } });

        // const status='false';
        // console.log(profile_menu_list);

        if(res.data.status==='success'){
            profile_menu_list.innerHTML=`
            <li><a href="../edit-profile/edit-profile.html">Edit Profile</a></li>
            <li><a href="#">Prefernces</a></li>
            <li><a href="appointments.html">Appointments</a></li>
            `;
        }
        else{
            profile_menu_list.innerHTML=`
            <li><a href="../login/login.html">Login</a></li>`;
        }
    }
    catch(err){
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


async function getAppointments() {

    try {

        const token=localStorage.getItem('token');

        const result=await axios.get('http://localhost:3000/get-appointments',{ headers: { 'Auth': token } });

        console.log(result.data.appointments);

        const appointments=result.data.appointments;

        if(appointments.length>0){

            appointment_table_div.hidden=false;
            appointment_message_div.hidden=true;

            for(let appointment of appointments){
                showAppointments(appointment);
            }
        }
        else{
            appointment_table_div.hidden=true;
            appointment_message_div.hidden=false;
            appointment_message_div.innerHTML=`<p>No upcoming appointments</p>`
        }

        
    } catch (error) {
        console.log(error);
    }
    
}


//SHOW SERVICES
function showAppointments(appointment){
    // console.log(service);

    const newRow=`<tr id=${appointment.id}>
                    <td>${new Date(appointment.date).toLocaleDateString("en-GB")}</</td>
                    <td>${appointment.serviceId.name}</td>
                    <td>${appointment.employeeId.name}</td>
                    <td>${appointment.salonId.name}</td>
                    <td><a href="../book_appoointment/book_apointment.html?id=${appointment.salonId.id}&edit=${true}&appointmentId=${appointment.id}"><button>Reschedule</button></a></td>
                    <td><button onclick="deleteService(${appointment.id})>Cancel</button></td>
                </tr>`

    appointment_table_body.innerHTML+=newRow;
}


//REMOVE Appointment
async function deleteAppointment(id){
    try{
        const token=localStorage.getItem('token');

        const res=await axios.delete(`http://localhost:3000/delete-appointment/${id}`,{headers:{'Auth':token}});

        document.getElementById(id).remove();
        alert(res.data.message);

    }
    catch(err){
        console.log(err);
    }
}