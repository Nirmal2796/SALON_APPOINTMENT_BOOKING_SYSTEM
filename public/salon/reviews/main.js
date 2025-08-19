

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

async function showReviews() {
    try {

         const token=localStorage.getItem('token');

        const result=await axios.get('http://localhost:3000/get-total-reviews',{ headers: { 'Auth': token } });

        console.log(result);
        
        const total=result.data.total;
        const avg=result.data.avg;

        document.getElementById("average-rating").textContent = avg.toFixed(1);
        // document.getElementById("stars").innerHTML = getStars(avg);
        document.getElementById("total-reviews").textContent = total;

                
    } catch (error) {
         console.log(error);
    }
}

function getStars(rating, maxStars = 5) {
    let starsHTML = "";
    for (let i = 1; i <= maxStars; i++) {
      if (i <= Math.floor(rating)) {
        starsHTML += `<i class="fas fa-star" style="color: gold;"></i>`;  // full
      } else if (i === Math.floor(rating) + 1 && rating % 1 !== 0) {
        starsHTML += `<i class="fas fa-star-half-alt" style="color: gold;"></i>`; // half
      } else {
        starsHTML += `<i class="far fa-star" style="color: gold;"></i>`;  // empty
      }
    }
    return starsHTML;
  }