
const username = document.getElementById('username');
const email = document.getElementById('email');
const start_date = document.getElementById('start-date');
const personal_form = document.getElementById('personal-form');

const specialization = document.getElementById('specialization');
const specialization_form = document.getElementById('specialization-form');
// const service_table_body=document.getElementById('service-table-body');

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
        getEmployeeDetails();
    }
    catch (err) {
        console.log(err);
    }
}




//CHANGE PROFILE MENU
async function changeProfileMenu() {
    try {
        const token = localStorage.getItem('token');

        const res = await axios.get('http://localhost:3000/validate-token', { headers: { 'Auth': token } });

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
    }

}

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


async function setLeave(e) {

    e.preventDefault();

    try {

        const token = localStorage.getItem('token');

        const closed_period = {
            start_date: closed_period_start_date.value,
            end_date: closed_period_end_date.value,
            description: closed_period_description.value
        };

        const res = await axios.post('http://localhost:3000/set-shift-leave', closed_period, { headers: { 'Auth': token } });

        console.log(res.data.closed_period);

        alert('Closed period added');

        showClosedPeriod(res.data.closed_period);

        set_closed_period_form.reset();
    }
    catch (err) {
        console.log(err);
        set_closed_period_form.reset();
    }

}



async function getLeave() {

    try {

        const token = localStorage.getItem('token');

        const leave = await axios.get('http://localhost:3000/get-leave', { headers: { 'Auth': token } });

        console.log(leave.data.data);

        const data = leave.data.data;

        if (data.length == 0) {
            console.log('No upcoming leaves');

            document.getElementById('shift-leave-table-div').hidden = true;

            document.getElementById('shift-leave-message-div').innerHTML = `<p>No upcoming closed periods</p>`
        }
        else {
            document.getElementById('shift-leave-table-div').hidden = false;

            for (const leave in data) {
                showClosedPeriod(data[leave]);
            }
        }

    } catch (error) {
        console.log(error);
    }
}

//SHOW CLOSED PERIOD
function showLeave(leave) {

    if (document.getElementById('shift-leave-table-div').hidden) {
        document.getElementById('shift-leave-table-div').hidden = false;
        document.getElementById('shift-leave-message-div').hidden = true;
    }

    const newRow = `<tr id=${leave.id}>
                                <td>${new Date(leave.start_date).toLocaleDateString("en-GB")}</td>
                                <td>${new Date(leave.end_date).toLocaleDateString("en-GB")}</td>
                                <td>${leave.description}</td>
                                <td><button onClick="deleteLeave(${leave.id})">Delete</button></td>
                </tr>
    `

    document.getElementById('shift-leave-table-body').innerHTML += newRow;
}


//REMOVE CLOSED PERIOD
async function deleteLeave(id) {
    try {
        const token = localStorage.getItem('token');

        const res = await axios.delete(`http://localhost:3000/delete-leave/${id}`, { headers: { 'Auth': token } });

        document.getElementById(id).remove();
        alert(res.data.message);


        const rows = document.getElementById('shift-leave-table').querySelectorAll('tr').length - 1;

        console.log(rows);
        if (rows == 0) {
            console.log(rows);

            document.getElementById('shift-leave-table-div').hidden = true;

            document.getElementById('shift-leave-message-div').innerHTML = `<p>No upcoming closed periods</p>`
        }

    }
    catch (err) {
        console.log(err);
    }
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function getEmployeeDetails() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('id');

        const res = await axios.get(`http://localhost:3000/get-employee/${id}`, { headers: { 'Auth': token } });

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

            const res = await axios.post(`http://localhost:3000/edit-employee/${id}`, user, { headers: { 'Auth': token } });

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

            const res = await axios.post(`http://localhost:3000/edit-employee-specializations/${id}`, employee, { headers: { 'Auth': token } });

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