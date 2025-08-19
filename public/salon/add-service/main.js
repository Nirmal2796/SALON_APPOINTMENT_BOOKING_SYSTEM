
const servicename = document.getElementById('service-name');
const description = document.getElementById('description');
const category=document.getElementById('category');
const duration = document.getElementById('duration');
const price = document.getElementById('price');

const add_service_form=document.getElementById('add-service-form');

add_service_form.addEventListener('submit', addService);



const profile_menu_list = document.getElementById('profile_menu_list');



//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() { 
    try{
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
    }
    catch(err){
        console.log(err);
    } 
}




//CHANGE PROFILE MENU
async function changeProfileMenu() {
    try{
        const token=localStorage.getItem('token');

        const res=await axios.get('http://localhost:3000/salon-validate-token',{ headers: { 'Auth': token } });

        // const status='false';
        // console.log(profile_menu_list);

        if(res.data.status==='success'){
            profile_menu_list.innerHTML=`
            <li><a href="../edit-profile/edit-profile.html">Edit Profile</a></li>
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


async function addService(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {

        service = {
            name: servicename.value,
            description: description.value,
            specialization:category.value,
            duration: duration.value,
            price:price.value
        };

        const res = await axios.post('http://localhost:3000/add-service', service, { headers: { 'Auth': token } });

        console.log(res);

        add_service_form.reset();

        alert('Service Added Successfully');
    }
    catch (err) {
        console.log(err);
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