
const service_table_body = document.getElementById('service-table-body');

const working_hours_list = document.getElementById('working_hours_list');

const profile_menu_list = document.getElementById('profile_menu_list');

const stars = document.querySelectorAll('#star-rating span');

const ratingInput = document.getElementById('rating');

const review_text = document.getElementById('review-text');

const review_form = document.getElementById('review-form');




//DOM CONTENT LOAD EVENT
document.addEventListener('DOMContentLoaded', DomLoad);

review_form.addEventListener('submit', addReview);

//DOM CONTENT LOADED
async function DomLoad() {
    try {
        // console.log('Dom Loaded');
        changeProfileMenu();
        window.scrollTo(0, 0);
        await getSalonInfo();
        setupStarRating('star-rating', 'rating');
        await getReview();
    }
    catch (err) {
        console.log(err);
    }
}

const reviews = [];



//CHANGE PROFILE MENU
async function changeProfileMenu() {
    try {
        const token = localStorage.getItem('token');

        const res = await axios.get('http://52.54.180.45:3000/validate-token', { headers: { 'Auth': token } });

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



//SHOW SERVICES
function showServices(service) {
    const newRow = `<tr id=${service.service.id}>
                    <td>${service.service.name}</td>
                    <td>${service.service.description}</td>
                    <td>${service.specialization.name}</td>
                    <td>${service.service.duration}</td>
                    <td>${service.service.price}</td>
                </tr>
    `

    // console.log(service);

    service_table_body.innerHTML += newRow;
}

//GET SALONS
async function getSalonInfo() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const res = await axios.get(`http://52.54.180.45:3000/get-salon/${id}`, { headers: { 'Auth': token } });

        console.log(res.data.salon.services);

        for (service in res.data.salon.services) {
            showServices(res.data.salon.services[service]);
        }

        for (working_hour in res.data.salon.working_hours) {
            showWorkingHours(res.data.salon.working_hours[working_hour]);
        }

        // console.log(document.getElementById('book-btn'));
        document.getElementById('book-btn').href = `../book_appoointment/book_appointment.html?id=${id}`;

    }
    catch (err) {
        console.log(err);
    }
}


//SHOW WORKING HOURS
function showWorkingHours(working_hour) {

    // console.log(formatTime(working_hour.start_time));
    const newRow = `<li class="working_hours_list_item">
                ${working_hour.day} <span>${formatTime(working_hour.start_time)}  --  ${formatTime(working_hour.end_time)}</span>
            </li>
    `

    working_hours_list.innerHTML += newRow;
}

//FORMAT TIME
function formatTime(timeString) {
    let [hours, minutes] = timeString.split(":");
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 or 12-hour format
    return `${hours}:${minutes} ${ampm}`;
}


function setupStarRating(starContainerId, hiddenInputId) {
    const stars = document.querySelectorAll(`#${starContainerId} span`);
    const ratingInput = document.getElementById(hiddenInputId);

    stars.forEach(star => {
        star.addEventListener('click', () => {
            let rating = star.getAttribute('data-value');
            ratingInput.value = rating;

            stars.forEach(s => {
                s.classList.toggle('selected', s.getAttribute('data-value') <= rating);
            });
        });

        star.addEventListener('mouseover', () => {
            stars.forEach(s => {
                s.style.color = s.getAttribute('data-value') <= star.getAttribute('data-value') ? 'gold' : '#ccc';
            });
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => {
                s.style.color = s.classList.contains('selected') ? 'gold' : '#ccc';
            });
        });
    });
}


async function addReview(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        const rating = {
            rate: ratingInput.value,
            feedback: review_text.value
        };

        const review = await axios.post(`http://52.54.180.45:3000/add-review/${id}`, rating, { headers: { 'Auth': token } });

        console.log(review);

    } catch (error) {
        console.log(error);
    }

}

async function getReview() {

    const token = localStorage.getItem('token');

    try {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');


        const result = await axios.get(`http://52.54.180.45:3000/get-review/${id}`, { headers: { 'Auth': token } });

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

function displayReviews(review) {

    // const isOwner = localStorage.getItem('isOwner') === "true";
    reviews.push(review);

    updateRatingSummary();

    // console.log(typeof (isOwner));

    const reviewEl = document.createElement("div");
    reviewEl.className = "review-item";


    reviewEl.innerHTML = `
    <div class="review-rating">${"★".repeat(review.rate)}${"☆".repeat(5 - review.rate)}</div>
    <p>${review.feedback}</p>`;

    document.getElementById("reviews-list").prepend(reviewEl);


}


function updateRatingSummary() {
    const total = reviews.length;
    const avg = reviews.reduce((sum, r) => sum + Number(r.rate), 0) / total;

    document.getElementById("average-rating").textContent = avg.toFixed(1);
    document.getElementById("total-reviews").textContent = total;
}


