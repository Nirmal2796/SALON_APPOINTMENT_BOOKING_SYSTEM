
const username = document.getElementById('username');
const email = document.getElementById('email');
const start_date = document.getElementById('start-date');
const personal_form = document.getElementById('personal-form');

const specialization = document.getElementById('specialization');
const specialization_form = document.getElementById('specialization-form');
// const service_table_body=document.getElementById('service-table-body');


const leave_start_date=document.getElementById('start-date');
const leave_end_date=document.getElementById('end-date');
const leave_description=document.getElementById('description');
const shift_leave_form=document.getElementById('shift-leave-form');


shift_leave_form.addEventListener('submit',addLeave);

const profile_menu_list = document.getElementById('profile_menu_list');


personal_form.addEventListener('submit', enableEditAndEdit);
specialization_form.addEventListener('submit', enableSpecializationEditAndEdit);

//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
        await getEmployeeDetails();
    }
    catch (err) {
        console.log(err);
    }
}




//CHANGE PROFILE MENU
async function changeProfileMenu() {
    try {
        const token = localStorage.getItem('token');

        const res = await axios.get('http://52.54.180.45:3000/salon-validate-token', { headers: { 'Auth': token } });

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

//TOGGLE TABS
function toggleTab(flag) {

    console.log(flag);

    const profile_tab = document.getElementById("perosnal-tab");
    const specialization_tab = document.getElementById("specialization-tab");
    const shift_leave_tab = document.getElementById("shift-leave-tab");

    if (flag == 1) {
        profile_tab.classList.toggle("active-li");
        specialization_tab.classList.remove("active-li");
        shift_leave_tab.classList.remove("active-li");

        document.getElementById('personal-section').classList.remove('hidden');
        document.getElementById('specialization-section').classList.add('hidden');
        document.getElementById('shift-leave-section').classList.add('hidden');
    }
    else if (flag == 2) {
        specialization_tab.classList.toggle("active-li");
        profile_tab.classList.remove("active-li");
        shift_leave_tab.classList.remove("active-li");

        document.getElementById('personal-section').classList.add('hidden');
        document.getElementById('specialization-section').classList.remove('hidden');
        document.getElementById('shift-leave-section').classList.add('hidden');
    }
    else {
        shift_leave_tab.classList.toggle("active-li");
        specialization_tab.classList.remove("active-li");
        profile_tab.classList.remove("active-li");

        document.getElementById('personal-section').classList.add('hidden');
        document.getElementById('specialization-section').classList.add('hidden');
        document.getElementById('shift-leave-section').classList.remove('hidden');

        getLeave();
    }

}

//SHOW ADD LEAVE FORM
function showAddLeaveForm() {
    document.getElementById('shift-leave-container').classList.toggle('hidden');
    const button = document.getElementById('add-shift-leave-button');

    if (button.innerText == 'Close') {
        button.innerText = 'Add Leave';
    }
    else {
        button.innerText = 'Close';
    }
}


//FORMAT DATE FOR INPUT
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

//GET EMPLOYEE DETAILS
async function getEmployeeDetails() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('id');

        const res = await axios.get(`http://52.54.180.45:3000/get-employee/${id}`, { headers: { 'Auth': token } });

        console.log(res.data);

        // console.log(res.data.employee.employee.start_date.toLocaleDateString('en-GB'));

        const st_Date = new Date(res.data.employee.employee.start_date);

        username.value = res.data.employee.employee.name;
        email.value = res.data.employee.employee.email;
        start_date.value = formatDateForInput(st_Date);
        // specialization.value=res.data.employee.specialization.name;

        const specializations = res.data.employee.specialization;

        for (let specialization in specializations) {
            console.log(specializations[specialization]);
            const checkbox = document.getElementById(specializations[specialization].name);
            checkbox.checked = true;
        }

    }
    catch (err) {
        console.log(err);
    }

}

//ENAABLE EDIT AND EDIT THE DATA
async function enableEditAndEdit(e) {

    e.preventDefault();

    try {

        const token = localStorage.getItem('token');

        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('id');

        const edit_profile_btn = document.getElementById('edit-profile-btn');

        console.log(edit_profile_btn.innerText == 'Edit Profile');

        // console.log(flag==1);

        if (edit_profile_btn.innerText == 'Edit Profile') {
            username.disabled = false;
            email.disabled = false;
            start_date.disabled = false;

            edit_profile_btn.innerText = 'EDIT';
        }
        else {

            user = {
                name: username.value,
                email: email.value,
                start_date: start_date.value
            };

            console.log(user);

            const res = await axios.post(`http://52.54.180.45:3000/edit-employee/${id}`, user, { headers: { 'Auth': token } });

            console.log(res.data);

            alert('Edited Sucessfully');

            edit_profile_btn.innerText = 'Edit Profile';

            username.value = res.data.employee.name;
            email.value = res.data.employee.email;
            start_date.value = formatDateForInput(new Date(res.data.employee.start_date));

            username.disabled = true;
            email.disabled = true;
            start_date.disabled = true;

        }

    } catch (error) {

        console.log(error);
    }

}

//GET SPECILIZATION
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

//ENABLE SPECIALIZATION AND EDIT THE DATA
async function enableSpecializationEditAndEdit(e) {

    e.preventDefault();

    try {

        const token = localStorage.getItem('token');

        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('id');

        const edit_specialization_btn = document.getElementById('edit-specialization-btn');

        console.log(edit_specialization_btn.innerText == 'Edit Profile');

        // console.log(flag==1);

        if (edit_specialization_btn.innerText == 'Edit Specialization') {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]'); // Get all checkboxes

            for (let checkbox in checkboxes) {
                checkboxes[checkbox].disabled = false;
            }

            edit_specialization_btn.innerText = 'EDIT';
        }
        else {

            const employee={
                specialization:getSpecilization(),
            };

            const res = await axios.post(`http://52.54.180.45:3000/edit-employee-specializations/${id}`, employee, { headers: { 'Auth': token } });

            console.log(res.data);

            alert('Edited Sucessfully');


            //disabling checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]'); // Get all checkboxes

            for (let checkbox in checkboxes) {
                checkboxes[checkbox].disabled = true;
            }


            edit_specialization_btn.innerText = 'Edit Specialization';

        }

    } catch (error) {

        console.log(error);
    }

}


//ADD LEAVE
async function addLeave(e) {

    e.preventDefault();

    try {

        const token = localStorage.getItem('token');

        const leave = {
            start_date: leave_start_date.value,
            end_date: leave_end_date.value,
            description: leave_description.value
        };

        const res = await axios.post(`http://52.54.180.45:3000/set-leave/${id}`, leave, { headers: { 'Auth': token } });

        console.log(res.data.leave);

        alert('Leave added');

        showLeave(res.data.leave);

        shift_leave_form.reset();
    }
    catch (err) {
        console.log(err);
        shift_leave_form.reset();
    }

}


//GET LEAVE
async function getLeave() {
    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('id');

        const res = await axios.get(`http://52.54.180.45:3000/get-leave/${id}`, { headers: { 'Auth': token } });

        console.log(res.data.data);

        const data=res.data.data;

        if(data.length==0){
            console.log('No Leaves');

            document.getElementById('shift-leave-table-div').hidden=true;

            document.getElementById('shift-leave-message-div').innerHTML=`<p>No Leaves</p>`
        }
        else{
            document.getElementById('shift-leave-table-div').hidden=false;

            document.getElementById('shift-leave-table-body').innerHTML='';

            for(const leave in data){
                showLeave(data[leave]);
            }
        }

    }
    catch (err) {
        console.log(err);
    }
}

//DELETE LEAVE


//SHOW LEAVE
function showLeave(leave){
    
      if(document.getElementById('shift-leave-table-div').hidden){
        document.getElementById('shift-leave-table-div').hidden=false;
        document.getElementById('shift-leave-message-div').hidden=true;
    }

    const newRow=`<tr id=${leave.id}>
                                <td>${new Date(leave.start_date).toLocaleDateString("en-GB" )}</td>
                                <td>${new Date(leave.end_date).toLocaleDateString("en-GB" )}</td>
                                <td>${leave.description}</td>
                                <td><button onClick="deleteLeave(${leave.id})">Delete</button></td>
                </tr>
    `

    document.getElementById('shift-leave-table-body').innerHTML+=newRow;
}

//REMOVE CLOSED PERIOD
async function deleteLeave(id){
    try{
        const token=localStorage.getItem('token');

        const res=await axios.delete(`http://52.54.180.45:3000/delete-leave/${id}`,{headers:{'Auth':token}});

        document.getElementById(id).remove();
        alert(res.data.message);


        const rows=document.getElementById('shift-leave-table').querySelectorAll('tr').length-1;

        console.log(rows);
        if(rows==0){
            console.log(rows);

            document.getElementById('shift-leave-table-div').hidden=true;

             document.getElementById('shift-leave-message-div').innerHTML=`<p>No Leaves</p>`
        }   

    }
    catch(err){
        console.log(err);
    }
}