
const service_table_body=document.getElementById('service-table-body');

const working_hours_list=document.getElementById('working_hours_list');

const profile_menu_list = document.getElementById('profile_menu_list');




//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() { 
    try{
        // console.log('Dom Loaded');
         changeProfileMenu();
        window.scrollTo(0, 0);
        getSalonInfo();
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
            <li><a href="#">Appointments</a></li>
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


//GET SALONS
async function getSalonInfo() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const res = await axios.get(`http://localhost:3000/get-salon/${id}`, { headers: { 'Auth': token } });

       console.log(res.data.salon.services);

       for(service in res.data.salon.services){
        showServices(res.data.salon.services[service]);
    }


    }
    catch (err) {
        console.log(err);
    }
}


//SHOW SERVICES
function showServices(service){
    const newRow=`<tr id=${service.id}>
                    <td>${service.name}</td>
                    <td>${service.description}</td>
                    <td>${service.category}</td>
                    <td>${service.duration}</td>
                    <td>${service.price}</td>
                </tr>
    `

    service_table_body.innerHTML+=newRow;
}

//GET SALONS
async function getSalonInfo() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const res = await axios.get(`http://localhost:3000/get-salon/${id}`, { headers: { 'Auth': token } });

       console.log(res.data.salon.services);

       for(service in res.data.salon.services){
        showServices(res.data.salon.services[service]);
    }

    for(working_hour in res.data.salon.working_hours){
        showWorkingHours(res.data.salon.working_hours[working_hour]);
    }


    }
    catch (err) {
        console.log(err);
    }
}


//SHOW WORKING HOURS
function showWorkingHours(working_hour){

    console.log(working_hour);
    const newRow=`<li class="working_hours_list_item">
                ${working_hour.day} <span>${formatTime(working_hour.start_time)}  --  ${formatTime(working_hour.end_time)}</span>
            </li>
    `

    working_hours_list.innerHTML+=newRow;
}

//FORMAT TIME
function formatTime(timeString) {
    let [hours, minutes] = timeString.split(":").map(Number);
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 or 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  }