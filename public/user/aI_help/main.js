

const profile_menu_list = document.getElementById('profile_menu_list');
const prompt = document.getElementById('prompt');
const responseDiv = document.getElementById('responsediv');

const askaiForm = document.getElementById('askaiform');

askaiForm.addEventListener('submit', askAi);

//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);

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


async function askAi(e) {

    try {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const askedPrompt = prompt.value;
        // console.log(askedPrompt);
        const res = await axios.post('http://localhost:3000/ask-ai', { askedPrompt }, { headers: { 'Auth': token } });

        console.log(res.data);

        if (responseDiv.querySelector('p') && responseDiv.children.length === 1) {
            responseDiv.innerHTML = '';
        }

        responseDiv.innerHTML = `<p>${res.data.response}</p>`;

        askaiForm.reset();

    } catch (error) {
        console.log(error);
    }

}