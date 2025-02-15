
const Category=document.getElementById('category');

const book_appointment_form = document.getElementById('book-appointment-form');

const profile_menu_list = document.getElementById('profile_menu_list');


// book_appointment_form.addEventListener('submit',showServiceDetails);
book_appointment_form.addEventListener('click', showServiceDetails);

//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
        // await getClosedPeriod();
        await getSpecialists();
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
    const submit_btn = document.getElementById('submit-btn');
    const select_btn = document.getElementById('select-btn');


    document.getElementById('service-details').hidden = false;
    // submit_btn.innerText='BOOK';

    const disabledDates=await getClosedPeriod();
    const Sdate=((disabledDates[0].start_date).split('T')[0]);
    const Edate=((disabledDates[0].end_date).split('T')[0]);

   
        
    document.getElementById("date").addEventListener("input", function () {

            let selectedDate = this.value; 
    if (selectedDate >= Sdate && selectedDate <= Edate)  {
                this.value = "";
                document.getElementById('date-msg').innerHTML = '<b>Not Available</b>';


                setTimeout(() => {
                    document.getElementById('date-msg').removeChild(document.getElementById('date-msg').firstChild);
                }, 2000);
            }
        });

    
    

    select_btn.hidden = true;


}

//GET CLOSED PERIOD
async function getClosedPeriod() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const res = await axios.get(`http://localhost:3000/get-closedPeriod/${id}`, { headers: { 'Auth': token } });

       console.log(res.data.closedPeriod);

       return res.data.closedPeriod;
        
    } catch (error) {
        console.log(error);
    }
    
}

//GET SPECIALIST
async function getSpecialists() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        console.log(Category.value);

        const res = await axios.get(`http://localhost:3000/get-specialits/${id}?specialization=${encodeURIComponent(Category.value)}`, { headers: { 'Auth': token } });

       console.log(res.data);

    //    return res.data.closedPeriod;
        
    } catch (error) {
        console.log(error);
    }
    
}