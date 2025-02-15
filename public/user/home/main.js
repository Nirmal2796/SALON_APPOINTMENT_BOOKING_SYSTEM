

const profile_menu_list = document.getElementById('profile_menu_list');
const salon_section=document.querySelector('.salon-section');



//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() { 
    try{
        // console.log('Dom Loaded');
         changeProfileMenu();
        window.scrollTo(0, 0);
        await getSalons();
    }
    catch(err){
        console.log(err);
    } 
}




//CHANGE PROFILE MENU
async function changeProfileMenu() {
    try{
        const token=localStorage.getItem('token');

        const res=await axios.get('http://localhost:3000/validate-token',{ headers: { 'Auth': token } });

        // const status='false';
        // console.log(profile_menu_list);

        if(res.data.status==='success'){
            profile_menu_list.innerHTML=`
            <li><a href="../edit-profile/edit-profile.html">Edit Profile</a></li>
            <li><a href="#">Prefernces</a></li>
            <li><a href="#">Appointments</a></li>
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


//GET SALONS
async function getSalons() {

    const token = localStorage.getItem('token');

    try {
        const res = await axios.get('http://localhost:3000/get-salons', { headers: { 'Auth': token } });

       console.log(res.data);

       
       res.data.salons.forEach(salon => {
        showsalons(salon);
    });

    }
    catch (err) {
        console.log(err);
    }
}


//SHOW MY salonS
function showsalons(salon){

    const newsalon=`<div class="salon-card" id=${salon.id}>
                    <img src="" alt="salon Image">
                    <h2>${salon.name}</h2>
                    <p>${salon.email}</p>
                    <a href="../salon_info/salon_info.html?id=${salon.id}">View salon</a>
                </div>`;
    
    salon_section.innerHTML+=newsalon;
}