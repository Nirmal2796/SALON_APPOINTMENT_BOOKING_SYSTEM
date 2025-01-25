
const servicename = document.getElementById('service-name');
const description = document.getElementById('description');
const category=document.getElementById('category');
const duration = document.getElementById('duration');
const price = document.getElementById('price');

const edit_service_form = document.getElementById('edit-service-form');

edit_service_form.addEventListener('submit', editService);



const profile_menu_list = document.getElementById('profile_menu_list');



//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
        getServiceDetails();
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


async function editService(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {

        service = {
            name: servicename.value,
            description: description.value,
            category:category.value,
            duration: duration.value,
            price: price.value
        };

        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('id');

        const res = await axios.post(`http://localhost:3000/edit-service/${id}`, service, { headers: { 'Auth': token } });

        console.log(res);

        edit_service_form.reset();

        window.location.href='../services/services.html';
    }
    catch (err) {
        console.log(err);
    }
}

async function getServiceDetails() {

    const token = localStorage.getItem('token');

    try {

        //window.location.search will return ?redirect='';
        //new URLSearchParams() This takes the query string and turns it into an object-like structure that lets you easily work with the parameters.
        //Once you create a URLSearchParams object, you can:
        // Get specific parameter values.
        // Add or remove parameters.
        // Iterate over all the parameters.            
        const urlParams = new URLSearchParams(window.location.search);
        id = urlParams.get('id');


        const res = await axios.get(`http://localhost:3000/get-service-details/${id}`, { headers: { 'Auth': token } });

        // console.log(res);

        servicename.value = res.data.service.name;
        description.value = res.data.service.description;
        category.value=res.data.service.category;
        duration.value = res.data.service.duration;
        price.value = res.data.service.price;

    }
    catch (err) {
        console.log(err);
    }

}