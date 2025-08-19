

const profile_menu_list = document.getElementById('profile_menu_list');

const appointment_table_body=document.getElementById('appointment-table-body');

const service_table_body=document.getElementById('service-table-body');


//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() { 
    try{
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);

         showAppointments();
         showServices();
         showReviews();
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