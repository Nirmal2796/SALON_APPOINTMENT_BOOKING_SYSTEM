const employee_start_date=document.getElementById('start-date');
const employee_email=document.getElementById('email');
const employee_name=document.getElementById('name');
const employee_specialization=document.getElementById('specialization');


const set_regular_shift_form=document.getElementById('set-regular-shift-form');
const add_employee_form=document.getElementById('add-employee-form');


const team_table_body=document.getElementById('team-table-body');

const profile_menu_list = document.getElementById('profile_menu_list');

set_regular_shift_form.addEventListener('submit',setRegularShift);
add_employee_form.addEventListener('submit',addEmployee);


//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
        initializeCheckboxListeners();
        await getRegularShift();
        await getEmployees();
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
            <li><a href="../../edit-profile/edit-profile.html">Edit Profile</a></li>
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


//SHOW REGULAR SHIFT
function showRegularShift(){
    document.getElementById('set-regular-shift-section').classList.toggle('hidden');
    const button=document.getElementById('regular-shift-button');

    if(button.innerText=='Close'){
        button.innerText='Regular Shift';
    }
    else{
        button.innerText='Close';
    }
}



//SHOW ADD EMPLOYEE FORM
function showAddEmployeeForm(){
    document.getElementById('add-employee-container').classList.toggle('hidden');
    const button=document.getElementById('add-employee-button');

    if(button.innerText=='Close'){
        button.innerText='Add Employee';
    }
    else{
        button.innerText='Close';
    }
}


//INITIALISE CHECKBOXES
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
  

//SET REGULAR SHIFT
async function setRegularShift(e) {

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


  const res=await axios.post('http://localhost:3000/set-regular_shift',data, {headers : {'Auth': token}});

  console.log(res);
//   set_working_hours_form.reset();

    }
    catch(err){
        console.log(err);
        // set_working_hours_form.reset();
    }
    
}

//ADD EMPLOYEE
async function addEmployee(e) {

    e.preventDefault();

    try{

        const token=localStorage.getItem('token');


        const employee={
            name:employee_name.value,
            email:employee_email.value,
            specialization:getSpecilization(),
            start_date:employee_start_date.value,
        };

        const res=await axios.post('http://localhost:3000/add-employee',employee, {headers : {'Auth': token}});

        console.log(res.data.employee);

        alert('Employee added');

        showEmployee(res.data.employee);

        add_employee_form.reset();
    }
    catch(err){
        console.log(err);
        add_employee_form.reset();
    }
    
}


//GET AND ADD VALUES OF REGULAR SHIFTS
async function getRegularShift() {

    // e.preventDefault();

    try{

        const token=localStorage.getItem('token');

    


  const res=await axios.get('http://localhost:3000/get-regular-shift',{headers : {'Auth': token}});

  console.log(res);
//   set_working_hours_form.reset();

const regular_shifts=res.data.data;

  for (let regular_shift of regular_shifts) {
    // console.log(regular_shift.day);
    const checkbox=document.getElementById(regular_shift.day.toLowerCase().toLowerCase());
    checkbox.checked=true;
    const startTime = document.getElementById(`start-${regular_shift.day.toLowerCase()}`);
    const endTime = document.getElementById(`end-${regular_shift.day.toLowerCase()}`);

      startTime.value=regular_shift.start_time;
      endTime.value=regular_shift.end_time;
      startTime.disabled=false;
      endTime.disabled=false;
      
  }


    }
    catch(err){
        console.log(err);
        // set_regular_shift_form.reset();
    }
    
}


//GET EMPLOYEEs
async function getEmployees() {
    
    try {

        const token=localStorage.getItem('token');
        
        const res=await axios.get('http://localhost:3000/get-employees',{headers:{'Auth':token}});

        console.log(res.data.employees);

        const data=res.data.employees;

        if(data.length==0){
            console.log('No Employees');

            document.getElementById('team-table-div').hidden=true;

            document.getElementById('team-msg-div').innerHTML=`<p>No Employees</p>`
        }
        else{
            document.getElementById('team-table-div').hidden=false;

            for(const employee in data){
                showEmployee(data[employee]);
            }
        }

    } catch (error) {
        console.log(error);
    }
}

//SHOW EMPLOYEE
function showEmployee(employee){
    
    if(document.getElementById('team-table-div').hidden){
        document.getElementById('team-table-div').hidden=false;
        document.getElementById('team-msg-div').hidden=true;
    }

   const newRow=`<tr id=${employee.employee.id} onclick="window.open('../employee_profile/employee_profile.html?id=${employee.employee.id}','_self')">
                    <td>${employee.employee.name}</td>
                    <td>${employee.employee.email}</td></tr>`

    team_table_body.innerHTML+=newRow;
}


 function getSpecilization() {

        const checkboxes = document.querySelectorAll('input[type="checkbox"]'); // Get all checkboxes
        const selectedSpecializations=[]; // Object to store the data

  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
        selectedSpecializations.push(checkbox.value);
    }
}
 
return selectedSpecializations;
}