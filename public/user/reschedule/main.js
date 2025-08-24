
const dateInput = document.getElementById("date");

const book_appointment_form = document.getElementById('book-appointment-form');

const timeDropDown = document.getElementById('time');

const profile_menu_list = document.getElementById('profile_menu_list');


book_appointment_form.addEventListener('submit', rescheduleAppointment);


dateInput.addEventListener('change', showTimeSlots);



let duration = 0;
let leaveDates = [];
let closedPeriodDates = [];
let booked_appointments;
let employee;
let working_hours;
let total_time = 0;

//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);

        // await ContinueOrPay();

        const today = new Date().toISOString().split("T")[0];
        dateInput.min = today;

        const urlParams = new URLSearchParams(window.location.search);
        edit = urlParams.get('edit');
        id = urlParams.get('id');
        if (edit) {
            await getAppointmentDetails();
            await getWorkingHours(id);
            await getLeave(employee.id);
            await getClosedPeriod(id);
            await getBookedAppointments(id);
        }
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
            <li><a href="../edit-profile/edit-profile.html">Edit Profile</a></li>
            
            <li><a href="../appointments/appointments.html">Appointments</a></li>
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

//GET EDITED APPOINTMENT DETIALS
async function getAppointmentDetails() {
    try {

        const token = localStorage.getItem('token');

        const urlParams = new URLSearchParams(window.location.search);
        const appointmentId = urlParams.get('appointmentId');

        const result = await axios.get(`http://localhost:3000/get-appointment/${appointmentId}`, { headers: { 'Auth': token } });

        console.log(result.data);
        // const appointment = result.data.appointment;
        employee = result.data.appointment.employeeId;
        duration = result.data.appointment.serviceId.duration;

    } catch (error) {
        console.log(error);
    }
}


//IS DATE IN BETWEEN NOT AVAILABLE DATES
function isDateInRange(date, range) {
    // console.log(range);
    const d = new Date(date);
    const from = new Date(range.start_date);
    const to = new Date(range.end_date);
    return d >= from && d <= to;
}

//IS DATE AVAILABLE
function isDateBlocked(date) {

    // console.log(closedPeriodDates);
    return closedPeriodDates.some(closedPeriodDatesRange => isDateInRange(date, closedPeriodDatesRange)) ||
        leaveDates.some(leaveDatesRange => isDateInRange(date, leaveDatesRange));


}

//EVENT FUNCTION FOR DATE INPUT
function handleDateSelection(event) {
    let selectedDate = event.target.value;

    // console.log('in handle date selection ');
    // console.log(leaveDates[0]);
    // console.log(isDateBlocked(selectedDate));

    if (isDateBlocked(selectedDate)) {
        event.target.value = "";
        document.getElementById("date-msg").innerHTML = '<b>Not Available</b>';
        timeDropDown.innerHTML = '';
        timeDropDown.disabled = true;

        setTimeout(() => {
            document.getElementById("date-msg").innerHTML = '';
        }, 2000);
    }
}

//GET LEAVE
async function getWorkingHours(id) {
    const token = localStorage.getItem('token');

    try {

        console.log('in working hours');
        const res = await axios.get(`http://localhost:3000/get-working-hours/${id}`, { headers: { 'Auth': token } });

        console.log(res);

        // document.getElementById("date").removeEventListener("input");

        // disableDates(res.data.data);

        working_hours = res.data.data;

    }
    catch (err) {
        console.log(err);
    }
}

//GET LEAVE
async function getLeave(id) {
    const token = localStorage.getItem('token');

    try {

        // const urlParams = new URLSearchParams(window.location.search);
        // id = urlParams.get('id');

        console.log('in get leaves');
        const res = await axios.get(`http://localhost:3000/get-leave/${id}`, { headers: { 'Auth': token } });

        console.log(res);

        // document.getElementById("date").removeEventListener("input");

        // disableDates(res.data.data);

        res.data.data.forEach((leaveDate => {
            leaveDates.push(leaveDate);
        }));

        disableDates();


    }
    catch (err) {
        console.log(err);
    }
}

//GET CLOSED PERIOD
async function getClosedPeriod(id) {

    const token = localStorage.getItem('token');

    try {

        const res = await axios.get(`http://localhost:3000/get-closedPeriod/${id}`, { headers: { 'Auth': token } });

        console.log(res.data.closedPeriod);

        //    disableDates(res.data.closedPeriod);

        closedPeriodDates = res.data.closedPeriod;
        disableDates();

    } catch (error) {
        console.log(error);
    }

}

//DISABLE DATES
function disableDates() {
    // const disabledDates=await getClosedPeriod();

    // const dateInput = document.getElementById("date");
    // const dateMsg = document.getElementById("date-msg");

    dateInput.removeEventListener("input", handleDateSelection);


    dateInput.addEventListener("input", handleDateSelection);

}

//SHOW TIMESLOTS AFTER DATE SELECTION
function showTimeSlots(e) {

    // console.log(working_hours);

    const date = new Date(dateInput.value);

    let day = parseInt(date.getDay()); // 0 (Sun) to 6 (Sat)

    day = day === 0 ? 7 : day;  // shift Sunday from 0 to 7

    let day_working_hours = null;

    for (let w in working_hours) {

        if (day == working_hours[w].id) {
            // console.log(working_hours[w].start_time, working_hours[w].end_time);

            day_working_hours = {
                start_time: working_hours[w].start_time,
                end_time: working_hours[w].end_time
            };
            break;
        }
        else if (day == 7) {
            // console.log('in else', day == working_hours[w].id) 
            e.target.value = '';
            day_working_hours = null;
            timeDropDown.disabled = true;
            timeDropDown.innerHTML = '';

            document.getElementById("date-msg").innerHTML = '<b>Not Available</b>';

            setTimeout(() => {
                document.getElementById("date-msg").innerHTML = '';
            }, 2000);

        }
    }


    if (day_working_hours != null) {

        const today = new Date().toISOString().split('T')[0];

        let time = new Date(`${today}T${day_working_hours.start_time}`);
        const endTime = new Date(`${today}T${day_working_hours.end_time}`);

        timeDropDown.disabled = false;
        timeDropDown.innerHTML = '';

        // console.log(day_working_hours , time, endTime);

        while (time < endTime) {

            // console.log('in while');

            const timeStr24 = time.toTimeString().split(' ')[0]; // value
            const timeStr12 = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }); // display



            // if( date == new Date().toISOString().split('T')[0]){
            // }

            const isOverlapping = booked_appointments.some(app => {
                return timeStr24 >= app.start_time && timeStr24 < app.end_time;
            });


            if (date.toDateString() === new Date().toDateString()) {

                //if its today.

                if (!isOverlapping && timeStr24 > new Date().toTimeString().split(' ')[0]) {
                    timeDropDown.innerHTML += `
               <option value="${timeStr24}" id="${timeStr24}">${timeStr12}</option>`;
                }
                else {
                    timeDropDown.innerHTML += '';
                }
            }
            else {

                if (!isOverlapping) {
                    timeDropDown.innerHTML += `
               <option value="${timeStr24}" id="${timeStr24}">${timeStr12}</option>`;
                }
            }



            time.setMinutes(time.getMinutes() + duration);
            // console.log(time);

        }

        if (timeDropDown.options.length === 0) {
            timeDropDown.innerHTML = `<option disabled selected>No slots available</option>`;
        }

    }
}

//GET BOOKED APPOINTMENTS
async function getBookedAppointments(id) {

    const token = localStorage.getItem('token');

    try {

        // const urlParams = new URLSearchParams(window.location.search);
        // const id = urlParams.get('id');

        // console.log('Employees>>', employee);


        const result = await axios.get(`http://localhost:3000/get-employee-appintments/${id}?employee=${employee}`, { headers: { 'Auth': token } });

        console.log(result);
        booked_appointments = result.data.appointments;

    } catch (error) {
        console.log(error);
    }

}

async function rescheduleAppointment(e) {
    try {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('appointmentId');
        admin = urlParams.get('appointmentId');

        date = {
            date: dateInput.value,
            time: timeDropDown.options[timeDropDown.selectedIndex].value
        }

        console.log(id);

        if (admin) {
            const result = await axios.post(`http://localhost:3000/reschedule-appointment/${id}`, date, { headers: { 'Auth': token } });
            window.location.href = "../../admin/admin.html";
        }
        else {

            const result = await axios.post(`http://localhost:3000/reschedule-appointment/${id}`, date, { headers: { 'Auth': token } });
            console.log(result);
            window.location.href = "../appointments/appointments.html";
        }


    } catch (error) {
        console.log(error);
    }
}

