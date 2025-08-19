const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const edit_profile_form = document.getElementById('edit-profile-form');

edit_profile_form.addEventListener('submit', editProfile);



//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
         changeProfileMenu();
        window.scrollTo(0, 0);

        await getUserDetails();

    }
    catch (err) {
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




async function editProfile(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {

        user = {
            username: username.value,
            email: email.value,
            password: password.value
        };

        const res = await axios.post('http://localhost:3000/edit-salon-profile', user, { headers: { 'Auth': token } });
    }
    catch (err) {
        console.log(err);
    }
}


async function getUserDetails() {

    const token = localStorage.getItem('token');

    try {
        const res = await axios.get('http://localhost:3000/get-salon', { headers: { 'Auth': token } });

        username.value=res.data.salon.name;
        email.value=res.data.salon.email;

    }
    catch (err) {
        console.log(err);
    }

}