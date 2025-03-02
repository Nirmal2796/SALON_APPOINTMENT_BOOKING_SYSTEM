
const Category=document.getElementById('category');

const select_btn = document.getElementById('select-btn');

const book_appointment_form = document.getElementById('book-appointment-form');

const profile_menu_list = document.getElementById('profile_menu_list');



book_appointment_form.addEventListener('submit',addToMainList);
// select_btn.addEventListener('click', showServiceDetails);

Category.addEventListener('change',showServiceDetails);
Category.dispatchEvent(new Event('change'));

//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
        await getClosedPeriod();
        // await getSpecialists();
    }
    catch (err) {
        console.log(err);
    }
}


let leaveDates = [];
let closedPeriodDates =[];
let total_amount=0;


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
            <li><a href="#">Appointments</a></li>
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


//SHOW SERVICE DETIALS
async function showServiceDetails() {
    // const submit_btn = document.getElementById('submit-btn');
    
    // select_btn.hidden = true;

    // document.getElementById('service-details').hidden = false;
    // document.getElementById('category').disabled=true;
    // submit_btn.innerText='BOOK';
   
    document.getElementById("date").value='';
    await getServies();
    await getSpecialists();

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

//GET SPECIALISTS
async function getSpecialists() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        console.log(Category.value);

        const res = await axios.get(`http://localhost:3000/get-specialits/${id}?specialization=${encodeURIComponent(Category.value)}`, { headers: { 'Auth': token } });

       console.log(res.data.employee);

       const employees=res.data.employee;
       document.getElementById('specialist').innerHTML='';

       for(let e in employees){

           document.getElementById('specialist').innerHTML+=`
           <option value="${employees[e].id}" id="${employees[e].id}">${employees[e].name}</option>`
       }
        
       document.getElementById('specialist').innerHTML+=`
           <option value="Any" id="" selected>Any</option>`

    //    return res.data.closedPeriod;
        
    } catch (error) {
        console.log(error);
    }
    
}


//GET ALL SERVICES
async function getServies() {
    try {

        const token = localStorage.getItem('token');

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const result = await axios.get(`http://localhost:3000/get-services/${id}?specialization=${encodeURIComponent(Category.value)}`, { headers: { 'Auth': token } });

        console.log(result.data);

        const services=result.data.services;
        
        document.getElementById('service-name').innerHTML='';

       for(let s in services){

        document.getElementById('service-name').innerHTML+=`
           <option value="${services[s].id}" id="${services[s].id}">${services[s].name}</option>`;

        document.getElementById('duration').innerHTML=`
                    <p id="duration-p" name="duration">
                        Duration: ${services[s].duration} Minutes
                    </p>`;

        
                    // console.log(document.getElementById('specialist').value);
            document.getElementById('price').innerHTML=`
                        <p id="price-p" name="price">
                            Price:
                            ${services[s].price}/-
                        </p>`;
       
       }

        
       
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

        const res = await axios.get(`http://localhost:3000/get-leave/${id}`, { headers: { 'Auth': token } });

        console.log(res.data.data);

        // document.getElementById("date").removeEventListener("input");

        // disableDates(res.data.data);

        leaveDates = res.data.data;  
        disableDates(); 


    }
    catch (err) {
        console.log(err);
    }
}


//DISABLE DATES
function disableDates(){
    // const disabledDates=await getClosedPeriod();

    const dateInput = document.getElementById("date");
    const dateMsg = document.getElementById("date-msg");

    dateInput.removeEventListener("input", handleDateSelection);
    

    dateInput.addEventListener("input", handleDateSelection);

}

//CHANGE PRICE AND DISABLE DATES AS PER SELECTED SPECIALIST AVAILABILITY
async function selectedEmployee(){

    const priceTxt=document.getElementById('price-p').innerText;

    const price = parseInt(priceTxt.match(/\d+/)[0]);

     document.getElementById("date").value='';

    if(document.getElementById('specialist').value != 'Any'){

        document.getElementById('price').innerHTML=`
                        <p id="price-p" name="price">
                            Price:
                            ${price +100}/-
                        </p>`;

        const eId= document.getElementById('specialist').value;
     
        leaveDates = []; 
        await getLeave(eId);
    }
    else{
        const priceTxt=document.getElementById('price-p').innerText;

        const price = parseInt(priceTxt.match(/\d+/)[0]);

        document.getElementById('price').innerHTML=`
                        <p id="price-p" name="price">
                            Price:
                            ${price -100}/-
                        </p>`;

        leaveDates = [];  
        disableDates();
    }
}


//EVENT FUNCTION FOR DATE INPUT
function handleDateSelection(event) {
    let selectedDate = event.target.value;

    for (let dateRange of [...closedPeriodDates, ...leaveDates]) {
        let Sdate = dateRange.start_date.split('T')[0];
        let Edate = dateRange.end_date.split('T')[0];

        if (selectedDate >= Sdate && selectedDate <= Edate) {
            event.target.value = "";
            document.getElementById("date-msg").innerHTML = '<b>Not Available</b>';

            setTimeout(() => {
                document.getElementById("date-msg").innerHTML = '';
            }, 2000);
            break;
        }
    }
}


//ADD TO MAIN LIST
async function addToMainList(e){

    e.preventDefault();

    const service=document.getElementById('service-name');

    console.log(service.value);

    const MainList=document.getElementById('main-service-list');

    MainList.hidden=false;
    document.getElementById('service-list-msg').hidden=true;
    // <li class="main-service-list_item">
    //                 service name <span>Price</span>   <span>Date</span>
    //             </li>
    // console.log();
    const newLi=`<li class="main-service-list_item" id=list-${service.value}>${service.innerText}  <span>${date.value}</span> <span>${price.innerText.substring(7)}</span> <button onclick="removeFromMainList('list-${service.value}')">DEL</button> </li>`;

    MainList.innerHTML+=newLi;

    total_amount+=parseInt(price.innerText.substring(7));
    document.getElementById('total').innerText=total_amount;

    book_appointment_form.reset(); 
    document.getElementById('pay').disabled=false;
    await getServies();

}

//ADD TO MAIN LIST
function removeFromMainList(id){

    // e.preventDefault();

    const service=document.getElementById(id);

    // console.log(service);

    const priceElement = service.querySelector("span:nth-child(2)");

    // console.log(priceElement);
    const MainList=document.getElementById('main-service-list');

    // MainList.removeChild(service);
    service.remove();

    total_amount-=parseInt(priceElement.innerText);
    // console.log(typeof(total_amount));
    if(total_amount == 0){
        
        document.getElementById('total').innerText=0;
        document.getElementById('pay').disabled=true;
    }
    else{
        document.getElementById('total').innerText=total_amount;
    }

    if (MainList.childElementCount === 0) {
        document.getElementById('service-list-msg').hidden=false;
        MainList.hidden=true;
    }
}


//APPOINTMENT PAYMENT
async function appointmentPayment(e) {

    const amount=document.getElementById('total').innerText;

    const token=localStorage.getItem('token');

    // console.log(amount);

    const res = await axios.get('http://localhost:3000/appointment_payment',amount, { headers: { 'Auth': token } });

    console.log(res.data.order.id);

    var options = {
        "key": res.data.key_id,
        "order_id": res.data.order.id,
        "handler": async function (res) {
            const result = await axios.post('http://localhost:3000/updateTransactions', {
                order_id: options.order_id,
                payment_id: res.razorpay_payment_id,
                status: 'successful'
            }, { headers: { 'Auth': token } });


            alert('Appointment Booked');
        },
        "retry": {
            enabled: false
        }
    };

    var razorpayObject = new Razorpay(options);

    razorpayObject.on('payment.failed', async (res) => {
        // console.log(res);
        const result = await axios.post('http://localhost:3000/updateTransactions', {
            order_id: options.order_id,
            payment_id: res.razorpay_payment_id,
            status: 'failed'
        }, { headers: { 'Auth': token } });

        alert('Payment Failed');
    });

    // console.log(razorpayObject);
    razorpayObject.open();
    e.preventDefault();

}
