const Category = document.getElementById('category');

const dateInput = document.getElementById("date");

const serviceDropdown = document.getElementById('service-name');

const specialist = document.getElementById('specialist');

const duration = document.getElementById('duration-p');

const timeDropDown = document.getElementById('time');

const select_btn = document.getElementById('select-btn');

const book_appointment_form = document.getElementById('book-appointment-form');

const MainList = document.getElementById('main-service-list');

const profile_menu_list = document.getElementById('profile_menu_list');

const continue_pay_btn = document.getElementById('continue_pay');

const title = document.querySelector('.book-appointment-container h1');

book_appointment_form.addEventListener('submit', addToMainList);

Category.addEventListener('change', showServiceDetails);
Category.dispatchEvent(new Event('change'));

dateInput.addEventListener('change', showTimeSlots);




let continueStep = 1;
let leaveDates = [];
let closedPeriodDates = [];
let working_hours;
let total_amount = 0;
let total_time = 0;
let booked_appointments;
let service_duration;
let employees = [];

//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);

        await ContinueOrPay();

        const urlParams = new URLSearchParams(window.location.search);
        const edit = urlParams.get('edit');
        if (edit) {
            await getAppointmentDetails();
        }
    }
    catch (err) {
        console.log(err);
    }
}

continue_pay_btn.addEventListener('click', ContinueOrPay);


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
            <li><a href="#">Prefernces</a></li>
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


async function ContinueOrPay() {
    // console.log(continueStep);

    if (continueStep == 1) {

        //to disable old dates.
        const today = new Date().toISOString().split("T")[0];
        dateInput.min = today;

        await getClosedPeriod();
        await getBookedAppointments();


        document.getElementById('service-div').hidden = true;
        document.getElementById('date-div').hidden = false;

        document.querySelectorAll('.main-service-list_item button').forEach(btn => {
            btn.remove();
        });

        title.textContent = 'Select Date & Time';

        continueStep++;

        return;
    }

    if (continueStep == 2) {

        // getAllListData();


        document.getElementById('date-div').hidden = true;
        document.getElementById('summary-div').hidden = false;
        book_appointment_form.hidden = true;


        const today = new Date().toISOString().split('T')[0];

        const time = new Date(`${today}T${timeDropDown.options[timeDropDown.selectedIndex].value}`);

        document.getElementById('summary-details').innerText = `Date : ${dateInput.value}
        Time : ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}` // time in 12 hour format


        continue_pay_btn.innerText = 'PAY';
        continue_pay_btn.addEventListener('click', appointmentPayment);

        title.textContent = 'Review and Confirm';

        continueStep++;
    }


}


//APPOINTMENT PAYMENT
async function appointmentPayment(e) {

    const amount = document.getElementById('total').innerText;

    const token = localStorage.getItem('token');

    console.log(amount);

    const urlParams = new URLSearchParams(window.location.search);
    const salonId = urlParams.get('id');

    const res = await axios.post('http://localhost:3000/appointment_payment', { amount }, { headers: { 'Auth': token } });

    console.log('Razorpay Order:', res.data);

    var options = {
        "key": res.data.key_id,
        "order_id": res.data.order.id,
        "amount": res.data.order.amount,
        "currency": "INR",
        "handler": async function (res) {

            try {

                const result = await axios.post('http://localhost:3000/updateTransactions', {
                    order_id: options.order_id,
                    payment_id: res.razorpay_payment_id,
                    status: 'successful'
                }, { headers: { 'Auth': token } });

                // console.log(result);


                const appointments = getAllListData();
                // console.log(appointments);

                const booked_appointments = await axios.post('http://localhost:3000/add-apointment', {
                    salonId: salonId,
                    appointments: appointments,
                    paymentId: result.data.payment.id,
                }, { headers: { 'Auth': token } });

                alert('Appointment Booked');

                MainList.hidden = true;
                document.getElementById('service-list-msg').hidden = false;
                document.getElementById('total').innerText = '0';

                // window.location.href = "../appointments/appointments.html";

            }
            catch (err) {
                console.error("Error updating transaction:", err.response?.data || err.message);
            }
        },
        "retry": {
            enabled: false
        }
    };

    var razorpayObject = new Razorpay(options);

    console.log(options);
    console.log(razorpayObject);
    // console.log('Opening rzp');



    razorpayObject.on('payment.failed', async (res) => {
        // console.log(res);
        const result = await axios.post('http://localhost:3000/updateTransactions', {
            order_id: options.order_id,
            payment_id: 'NA',
            status: 'failed'
        }, { headers: { 'Auth': token } });

        alert('Payment Failed');
        razorpayObject.close();
    });


    razorpayObject.open();
    e.preventDefault();
}



//ADD TO MAIN LIST
async function addToMainList(e) {

    e.preventDefault();

    const serviceDropdown = document.getElementById('service-name');
    const service = serviceDropdown.options[serviceDropdown.selectedIndex];

    const specialistDropdown = document.getElementById('specialist');
    const specialist = specialistDropdown.options[specialistDropdown.selectedIndex];
    // const timeDropDown =document.getElementById('time');


    MainList.hidden = false;
    document.getElementById('service-list-msg').hidden = true;

    const newLi = `<li class="main-service-list_item" id=list-${service.value} data-specialist-id="${specialist.value}" data-specialization-id="${Category.value}">${service.text} <span>${specialist.text}</span> <span>${service_duration}M</span> <span>${price.innerText.substring(7)}</span> <button onclick="removeFromMainList('list-${service.value}')">DEL</button> </li>`;

    MainList.innerHTML += newLi;

    total_amount += parseInt(price.innerText.substring(7));
    document.getElementById('total').innerText = total_amount;

    employees.push({
        employeeId: specialist.value,
        specializationId: Category.value
    });

    book_appointment_form.reset();
    continue_pay_btn.disabled = false;
    Category.dispatchEvent(new Event('change'));
}

//ADD TO MAIN LIST
function removeFromMainList(id) {

    // e.preventDefault();

    const service = document.getElementById(id);

    // console.log(service);

    const priceElement = service.querySelector("span:nth-child(3)");

    const index = employees.indexOf(service.getAttribute('data-specialist-id'));

    employees.splice(index, 1);

    //  service.querySelector("span:nth-child(2)");

    // console.log(priceElement);
    // const MainList = document.getElementById('main-service-list');

    // MainList.removeChild(service);
    service.remove();

    total_amount -= parseInt(priceElement.innerText);
    // console.log(typeof(total_amount));
    if (total_amount == 0) {

        document.getElementById('total').innerText = 0;
        continue_pay_btn.disabled = true;
    }
    else {
        document.getElementById('total').innerText = total_amount;
    }

    if (MainList.childElementCount === 0) {
        document.getElementById('service-list-msg').hidden = false;
        MainList.hidden = true;
    }
}

//GET ALL LIST DATA
function getAllListData() {
    const listItems = document.querySelectorAll(".main-service-list_item");
    const data = [];

    let currentStartTime = timeDropDown.options[timeDropDown.selectedIndex].value;

    listItems.forEach(li => {

        const serviceId = li.id.replace('list-', '');
        const date = dateInput.value;
        const start_time = currentStartTime;
        const price = li.children[2].textContent.trim().replace("/-", "");
        const specialistId = li.getAttribute("data-specialist-id");

        // Get duration (like "30M") from li.children[1], for example
        const durationText = li.children[1].textContent.trim(); // "30M"
        const duration = parseInt(durationText); // 30

        // Push the current data
        data.push({
            serviceId,
            date,
            start_time,
            price,
            specialistId
        });

        // Update currentStartTime for the next iteration
        const [h, m, s] = currentStartTime.split(":").map(Number);
        const dateObj = new Date();
        dateObj.setHours(h, m + duration, s || 0);

        // Get new time for next li
        currentStartTime = dateObj.toTimeString().split(" ")[0];
        // console.log(currentStartTime);
    })

    // console.log(data); // Output the collected data
    return data;
}


//SHOW SERVICE DETIALS
async function showServiceDetails() {

    // document.getElementById("date").value = '';
    await getServies();
    await getSpecialists();
    specialist.disabled = true;

}

//GET ALL SERVICES
async function getServies() {
    try {

        const token = localStorage.getItem('token');

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const result = await axios.get(`http://localhost:3000/get-services/${id}?specialization=${Category.value}`, { headers: { 'Auth': token } });

        // console.log(result.data);

        const services = result.data.services;

        console.log(services);

        serviceDropdown.innerHTML = '<option value="">Select a Service</option>';
        document.getElementById('duration').innerHTML = '';
        document.getElementById('price').innerHTML = '';

        const servicesMap = {};

        // document.getElementById('service-name').innerHTML='';

        for (let s of services) {

            servicesMap[s.id] = s;

            serviceDropdown.innerHTML += `
           <option value="${s.id}" id="${s.id}">${s.name}</option>`;

        }



        serviceDropdown.addEventListener('change', function () {
            const selectedService = servicesMap[this.value]; // Get selected service details

            specialist.disabled = false;

            if (selectedService) {
                document.getElementById('duration').innerHTML = `
                <p id="duration-p" name="duration">
                    Duration: ${selectedService.duration} Minutes
                </p>`;

                document.getElementById('price').innerHTML = `
                <p id="price-p" name="price">
                    Price: ${selectedService.price}/-
                </p>`;


                service_duration = selectedService.duration;

                // console.log(service_duration);
            }
        });



    }
    catch (err) {
        console.log(err);
    }

}


//GET SPECIALISTS
async function getSpecialists() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        console.log('Category value >>>>', Category.value);

        const res = await axios.get(`http://localhost:3000/get-specialits/${id}?specialization=${Category.value}`, { headers: { 'Auth': token } });

        console.log(res.data.employee);

        const employees = res.data.employee;
        document.getElementById('specialist').innerHTML = '';

        document.getElementById('specialist').innerHTML += `
           <option value="0" id="0" selected>Any</option>`

        for (let e in employees) {

            document.getElementById('specialist').innerHTML += `
           <option value="${employees[e].id}" id="${employees[e].id}">${employees[e].name}</option>`
        }



        //    return res.data.closedPeriod;

    } catch (error) {
        console.log(error);
    }

}

//
async function getBookedAppointments() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        console.log('Employees>>', employees);

        //JSON.stringify(employees) converts the employees array to a JSON string.

        // encodeURIComponent ensures that the string is safely included in the URL. 
        //encodeURIComponent because URLs have some restrictions on special characters (like {, }, [, ], and spaces).

        const result = await axios.get(`http://localhost:3000/get-booked-appointments/${id}?employees=${encodeURIComponent(JSON.stringify(employees))}`, { headers: { 'Auth': token } });

        // console.log(result);

        const services = document.querySelectorAll('#main-service-list li');

        // console.log('selected employees',result.data.selectedEmployee);
        const selectedEmployees = result.data.selectedEmployee;

        services.forEach(async (service) => {

            //set the employee id for the any professional selection 
            const match = selectedEmployees.find(semp => semp.specializationId == service.getAttribute('data-specialization-id'));

            console.log(match);

            if (service.getAttribute('data-specialist-id') == 0) {
                service.setAttribute('data-specialist-id', match.selectedEmployee);
            }

            //     //total time
            total_time += parseInt(service.querySelector('span:nth-child(2)').textContent);
            await getLeave(match.selectedEmployee);

        })

        // console.log(total_time);

        working_hours = result.data.working_hours;
        booked_appointments = result.data.appointments;

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


function convertToHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours == 0) {
        return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
}


function showTimeSlots() {

    // console.log(total_time);

    const date = new Date(dateInput.value);

    let day = parseInt(date.getDay()); // 0 (Sun) to 6 (Sat)

    day = day === 0 ? 7 : day;  // shift Sunday from 0 to 7

    let day_working_hours;

    for (let w in working_hours) {

        if (day == working_hours[w].id) {
            // console.log(working_hours[w].start_time, working_hours[w].end_time);
            day_working_hours = {
                start_time: working_hours[w].start_time,
                end_time: working_hours[w].end_time
            };
            break;
        }
    }


    const today = new Date().toISOString().split('T')[0];

    let time = new Date(`${today}T${day_working_hours.start_time}`);
    const endTime = new Date(`${today}T${day_working_hours.end_time}`);

    timeDropDown.disabled = false;
    let hasAvailableSlot = false;
    timeDropDown.innerHTML = '';

    while (time < endTime) {

        const timeStr24 = time.toTimeString().split(' ')[0]; // value
        const timeStr12 = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }); // display



        // if( date == new Date().toISOString().split('T')[0]){
        // }

        const isOverlapping = booked_appointments.some(app => {
            return timeStr24 >= app.start_time && timeStr24 < app.end_time;
        });


        if (date.toISOString().split('T')[0] == new Date().toISOString().split('T')[0]) {

            //if its today.

            if (!isOverlapping && timeStr24 > new Date().toTimeString().split(' ')[0]) {
                timeDropDown.innerHTML += `
               <option value="${timeStr24}" id="${timeStr24}">${timeStr12}</option>`;
            }
        }
        else {

            if (!isOverlapping) {
                timeDropDown.innerHTML += `
               <option value="${timeStr24}" id="${timeStr24}">${timeStr12}</option>`;
            }
        }



        time.setMinutes(time.getMinutes() + total_time);

    }

    if (timeDropDown.options.length === 0) {
        timeDropDown.innerHTML = `<option disabled selected>No slots available</option>`;
    }
}

function showService() {
    document.getElementById('service-div').hidden = false;

    document.getElementById('date-div').hidden = true;

    document.querySelectorAll('.main-service-list_item').forEach(item => {
        item.innerHTML += `<button onclick="removeFromMainList('${item.id}')">DEL</button> </li>`;
    });

    title.textContent = 'Select Services';
    continueStep--;
}

function showDateTime() {
    document.getElementById('date-div').hidden = false;
    document.getElementById('summary-div').hidden = true;
    book_appointment_form.hidden = false;

    title.textContent = 'Select Date & Time';
    continue_pay_btn.innerText = 'Continue';
    continue_pay_btn.removeEventListener('click', appointmentPayment);
    continueStep--;
}


function isDateInRange(date, range) {
    // console.log(range);
    const d = new Date(date);
    const from = new Date(range.start_date);
    const to = new Date(range.end_date);
    return d >= from && d <= to;
}


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
async function getLeave(id) {
    const token = localStorage.getItem('token');

    try {

        // const urlParams = new URLSearchParams(window.location.search);
        // id = urlParams.get('id');

        console.log('in get leaves');
        const res = await axios.get(`http://localhost:3000/get-leave/${id}`, { headers: { 'Auth': token } });

        console.log(res.data.data);

        // document.getElementById("date").removeEventListener("input");

        // disableDates(res.data.data);

        res.data.data.forEach((leaveDate=>{
            leaveDates.push(leaveDate);
        }));
        
        disableDates();


    }
    catch (err) {
        console.log(err);
    }
}

//GET CLOSED PERIOD
async function getClosedPeriod() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const res = await axios.get(`http://localhost:3000/get-closedPeriod/${id}`, { headers: { 'Auth': token } });

        console.log(res.data.closedPeriod);

        //    disableDates(res.data.closedPeriod);

        closedPeriodDates = res.data.closedPeriod;
        disableDates();

    } catch (error) {
        console.log(error);
    }

}