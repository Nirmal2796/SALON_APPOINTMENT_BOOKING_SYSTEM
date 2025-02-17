
const service_table_body=document.getElementById('service-table-body');

const profile_menu_list = document.getElementById('profile_menu_list');




//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
        await getServies();
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

//GET ALL SERVICES
async function getServies() {
    try {

        const token = localStorage.getItem('token');

        const result = await axios.get('http://localhost:3000/get-salon-services', { headers: { 'Auth': token } });

        console.log(result.data.services);

        for(let service in result.data.services){
            showServices(result.data.services[service]);
        }

    }
    catch (err) {
        console.log(err);
    }

}


//SHOW SERVICES
function showServices(service){
    // console.log(service);
    const newRow=`<tr id=${service.service.id}>
                    <td>${service.service.name}</td>
                    <td>${service.service.description}</td>
                    <td>${service.specialization.name}</td>
                    <td>${service.service.duration}</td>
                    <td>${service.service.price}</td>
                    <td><a href="../edit-service/edit-service.html?id=${service.service.id}"><button>Edit</button></a></td>
                    <td><button onclick="deleteService(${service.service.id})">Delete</button></td>
                </tr>
    `

    service_table_body.innerHTML+=newRow;
}


//REMOVE SERVICE
async function deleteService(id){
    try{
        const token=localStorage.getItem('token');

        const res=await axios.delete(`http://localhost:3000/delete-service/${id}`,{headers:{'Auth':token}});

        document.getElementById(id).remove();
        alert(res.data.message);


    }
    catch(err){
        console.log(err);
    }
}