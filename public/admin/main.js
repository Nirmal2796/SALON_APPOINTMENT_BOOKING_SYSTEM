
const appointment_table_body=document.getElementById('appointment-table-body');
const user_table_body=document.getElementById('user-table-body');


//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() { 
    try{
        // console.log('Dom Loaded');
        // changeProfileMenu();
        window.scrollTo(0, 0);

        getAllUsers();
        getAllAppointments();
        //  showAppointments();
        //  showServices();
        //  showReviews();
    }
    catch(err){
        console.log(err);
    } 
}

  // Open first tab by default
  document.querySelector('.nav-list a').click();

  function openTab(evt, tabId) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    
    // Remove active class from all tabs
    document.querySelectorAll('.nav-list a').forEach(el => el.classList.remove('active'));
    
    // Show current tab content
    document.getElementById(tabId).style.display = 'block';
    
    // Add active class to clicked tab
    evt.currentTarget.classList.add('active');
  }


  async function getAllAppointments(params) {
    try {

         const token=localStorage.getItem('token');

         console.log('in show appointments');

        const result=await axios.get('http://54.162.57.159:3000/get-all-appointments',{ headers: { 'Auth': token } });

        console.log(result);
        
        const appointments=result.data.appointments

        appointments.forEach(appointment => {
            const newRow= `<tr id=${appointment.id}>
          <td>${appointment.userId.name}</td>
          <td>${appointment.userId.email}</td>
          <td>${appointment.salonId.name}</td>
          <td>${appointment.salonId.email}</td>
          <td>${appointment.serviceId.name}</td>
          <td>${appointment.employeeId ? appointment.employeeId.name : '-'}</td>
          <td>${new Date(appointment.date).toLocaleDateString("en-GB")}</td>
          <td>
            <button class="edit-btn"><a href="../user/reschedule/rechedule.html?id=${appointment.salonId.id}&edit=${true}&appointmentId=${appointment.id}&admin=${true}">Reschedule</a></button>
            <button class="delete-btn" onclick="deleteAppointment(this)">Delete</button>
          </td>
        </tr>`

    appointment_table_body.innerHTML+=newRow;
        });

        console.log(appointment_table_body);
    } catch (error) {
        console.log(error);
    }
  }

   async function getAllUsers() {
    try {

         const token=localStorage.getItem('token');

         console.log('in show users');

        const result=await axios.get('http://54.162.57.159:3000/get-all-users',{ headers: { 'Auth': token } });

        console.log(result);
        
        const users=result.data.users

        users.forEach(user => {
            const newRow= `<tr id=${user.id}>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <button class="edit-btn"><a href="../user/edit-profile/edit-profile.html?id=${user.id}&edit=${true}&admin=${true}">Edit</a></button>
            <button class="delete-btn" onclick="deleteUser(this)">Delete</button>
          </td>
        </tr>`

    user_table_body.innerHTML+=newRow;
        });

        console.log(appointment_table_body);
    } catch (error) {
        console.log(error);
    }
  }


  //REMOVE Appointment
async function deleteAppointment(btn){
    try{
        const token=localStorage.getItem('token');

        const row = btn.closest("tr");      // find the row
        const id = row.id; 

        const res=await axios.delete(`http://54.162.57.159:3000/delete-admin-appointment/${id}`,{headers:{'Auth':token}});

        row.remove(); 
        alert(res.data.message);

    }
    catch(err){
        console.log(err);
    }
}

  //REMOVE User
async function deleteUser(btn){
    try{
        const token=localStorage.getItem('token');

        const row = btn.closest("tr");      // find the row
        const id = row.id; 

        const res=await axios.delete(`http://54.162.57.159:3000/delete-admin-user/${id}`,{headers:{'Auth':token}});

        row.remove(); 
        alert(res.data.message);

    }
    catch(err){
        console.log(err);
    }
}