

const profile_menu_list = document.getElementById('profile_menu_list');

const appointment_table_body = document.getElementById('appointment-table-body');

const service_table_body = document.getElementById('service-table-body');

const reviewsList = document.getElementById("reviews-list");

// Toggle reply form
reviewsList.addEventListener("click", function (e) {
    if (e.target.classList.contains("reply-link")) {
        e.preventDefault();
        const form = e.target.nextElementSibling;
        form.style.display = form.style.display === "none" ? "block" : "none";
    }
});


//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);


//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);

        showReviews();
        getReviews();
    }
    catch (err) {
        console.log(err);
    }
}




//CHANGE PROFILE MENU
async function changeProfileMenu() {
    try {
        const token = localStorage.getItem('token');

        const res = await axios.get('http://52.54.180.45:3000/salon-validate-token', { headers: { 'Auth': token } });

        // const status='false';
        // console.log(profile_menu_list);

        if (res.data.status === 'success') {
            profile_menu_list.innerHTML = `
            <li><a href="../edit-profile/edit-profile.html">Edit Profile</a></li>
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

async function showReviews() {
    try {

        const token = localStorage.getItem('token');

        const result = await axios.get('http://52.54.180.45:3000/get-total-reviews', { headers: { 'Auth': token } });

        console.log(result);

        const total = result.data.total;
        const avg = result.data.avg;

        document.getElementById("average-rating").textContent = avg.toFixed(1);
        document.getElementById("stars").innerHTML = getStars(avg);
        document.getElementById("total-reviews").textContent = total;


    } catch (error) {
        console.log(error);
    }
}

async function getReviews() {
    try {

        const token = localStorage.getItem('token');

        const result = await axios.get('http://52.54.180.45:3000/get-reviews', { headers: { 'Auth': token } });

        console.log(result);

        const reviewArray = result.data.reviews;

        reviewArray.forEach(review => {
            // console.log(review);
            displayReviews(review);
        });


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


function displayReviews(review) {

    const reviewEl = document.createElement("div");
    reviewEl.className = `review-item`;
    reviewEl.id = review.id;

    reviewEl.innerHTML = `
    <div class="review-rating">${getStars(review.rate)}</div>
    <p>${review.feedback}</p>
    <a href="#" class="reply-link">Reply</a>

      <form class="reply-form" style="display:none; margin-top:8px;">
        <textarea placeholder="Write your reply..." rows="2" style="width:100%;"></textarea><br>
        <button type="submit">Submit</button>
      </form>
      <div class="replies">
       
      </div>`;

    document.getElementById("reviews-list").prepend(reviewEl);
    showReply(review.reply, reviewEl.id);
}



// Handle reply form submit
reviewsList.addEventListener("submit", async function (e) {
    if (e.target.classList.contains("reply-form")) {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const textarea = e.target.querySelector("textarea");
        const replyText = textarea.value.trim();
        if (!replyText) return;

        const reviewItem = e.target.closest(".review-item");
        const reviewId = reviewItem.id;

        const result = await axios.post(`http://52.54.180.45:3000/add-reply/${reviewId}`, { replyText }, { headers: { 'Auth': token } });

        console.log(result);

        showReply(replyText, reviewId);
        // Reset + hide form
        textarea.value = "";
        e.target.style.display = "none";
    }
});

function showReply(reply, reviewId) {
    // Add new reply

    const reviewItem = document.getElementById(reviewId);
    let repliesContainer;
    if (reviewItem) {
        repliesContainer = reviewItem.querySelector(".replies");
        console.log(repliesContainer); // ✅ got it
    }

    const p=repliesContainer.querySelector('p');
    if(p){
        p.textContent = "Admin Reply: " + reply;
    }
    else{

    const replyEl = document.createElement("p");
    replyEl.classList.add("reply");
    replyEl.textContent = "Admin Reply: " + reply ? reply : '-';
    repliesContainer.appendChild(replyEl);
    }    


    
}