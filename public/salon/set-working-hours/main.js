
const closed_period_start_date=document.getElementById('start-date');
const closed_period_end_date=document.getElementById('end-date');
const closed_period_description=document.getElementById('description');


const set_working_hours_form=document.getElementById('set-working-hours-form');
const set_closed_period_form=document.getElementById('set-closed-period-form');


const profile_menu_list = document.getElementById('profile_menu_list');



set_working_hours_form.addEventListener('submit',setWorkingHours);
set_closed_period_form.addEventListener('submit',setClosedPeriod);

//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() { 
    try{
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
        initializeCheckboxListeners();
        await getWorkingHours();
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
            <li><a href="../../edit-profile/edit-profile.html">Edit Profile</a></li>
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

function toggleTab(){
    document.getElementById("working-hours-tab").classList.toggle("active-li");
    document.getElementById("closed-period-tab").classList.toggle("active-li");

    document.getElementById('set-working-hours-section').classList.toggle('hidden');
    document.getElementById('set-closed-period-section').classList.toggle('hidden');
}

function showAddClosedPeriodForm(){
    document.getElementById('set-closed-period-container').classList.toggle('hidden');
    const button=document.getElementById('add-closed-period-button');

    if(button.innerText=='Close'){
        button.innerText='Add Closed Period';
    }
    else{
        button.innerText='Close';
    }
}



function initializeCheckboxListeners() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        const day = this.value.toLowerCase(); // Get the day (e.g., "monday")
        const startTimeInput = document.getElementById(`start-${day.toLowerCase()}`);
        const endTimeInput = document.getElementById(`end-${day.toLowerCase()}`);
  
        if (this.checked) {
          // Enable the time inputs and make them required
          startTimeInput.disabled = false;
          endTimeInput.disabled = false;
          startTimeInput.required = true;
          endTimeInput.required = true;
        } else {
          // Disable the time inputs and clear values
          startTimeInput.disabled = true;
          endTimeInput.disabled = true;
          startTimeInput.required = false;
          endTimeInput.required = false;
          startTimeInput.value = "";
          endTimeInput.value = "";
        }
      });
    });
  }
  
 

async function setWorkingHours(e) {

    e.preventDefault();

    try{

        const token=localStorage.getItem('token');

        const checkboxes = document.querySelectorAll('input[type="checkbox"]'); // Get all checkboxes
        const data = {}; // Object to store the data

  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      const day = checkbox.value; // Get the day (e.g., Monday)
      const startTime = document.getElementById(`start-${day.toLowerCase()}`).value;
      const endTime = document.getElementById(`end-${day.toLowerCase()}`).value;

      // Add the data to the object
      data[day] = {
        start_time: startTime,
        end_time: endTime
      };
    //   console.log(data[day]);
    }

    // console.log(checkbox)
  }

  console.log(data);


  const res=await axios.post('http://localhost:3000/set-working-hours',data, {headers : {'Auth': token}});

  console.log(res);
//   set_working_hours_form.reset();

    }
    catch(err){
        console.log(err);
        // set_working_hours_form.reset();
    }
    
}

async function setClosedPeriod(e) {

    e.preventDefault();

    try{

        const closed_period={
            start_date:closed_period_start_date,
            end_date:closed_period_end_date,
            description:closed_period_description
        };

        const res=await axios.post('http://localhost:3000/set-closed-period',closed_period, {headers : {'Auth': token}});

        console.log(res);

        set_closed_period_form.reset();
    }
    catch(err){
        console.log(err);
        set_closed_period_form.reset();
    }
    
}



async function getWorkingHours() {

    // e.preventDefault();

    try{

        const token=localStorage.getItem('token');

    


  const res=await axios.get('http://localhost:3000/get-working-hours',{headers : {'Auth': token}});

  console.log(res);
//   set_working_hours_form.reset();

const working_hours=res.data.data;

  for (let working_hour of working_hours) {
    // console.log(working_hour.day);
    const checkbox=document.getElementById(working_hour.day.toLowerCase().toLowerCase());
    checkbox.checked=true;
      const startTime = document.getElementById(`start-${working_hour.day.toLowerCase()}`);
      const endTime = document.getElementById(`end-${working_hour.day.toLowerCase()}`);

      startTime.value=working_hour.start_time;
      endTime.value=working_hour.end_time;
      
  }


    }
    catch(err){
        console.log(err);
        // set_working_hours_form.reset();
    }
    
}