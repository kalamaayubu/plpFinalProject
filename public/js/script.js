document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    //-----------------THE FRONTEND JAVASCRIPT---------------------------

    // THE PROFILE DETAILS AND LOGOUT FUNCTIONALITY
    const userInfoAndLogout = document.getElementById('userInfoAndLogout');
    const userDropdown = document.getElementById('userDropdown');
    if (userInfoAndLogout && userDropdown) {
        userInfoAndLogout.addEventListener('mouseenter', () => {
            userDropdown.style.display = 'flex';
        });
        userInfoAndLogout.addEventListener('mouseleave', () => {
            userDropdown.style.display = 'none';
        });
    }
        
    const footer = document.getElementById('footer');

    // Open dropdown menu
    function openDropdown(){
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'flex';
        menuDropdown.style.display = 'flex';
    }

    // Close dropdown menu
    function closeDropdown(){
        menuDropdown.style.display = 'none';
        menuIcon.style.display = 'flex';
        closeIcon.style.display = 'none';
    }

    // The platform menu functionality
    const platformMenuIcon = document.getElementById('platformMenuIcon');
    const platformCloseIcon = document.getElementById('platformCloseIcon');
    const dropDownMenu = document.getElementById('dropDownMenu');
  
    //Check the screewidth
    function checkScreenWidth() {
        if (window.innerWidth >= 1200) {
            dropDownMenu.style.width = '200px';
        } 
    }
    window.addEventListener('resize', checkScreenWidth);

    // Open wastEradict platform dropdown menu
    function openPlatformDropdown() {
        platformMenuIcon.style.display = 'none';
        platformCloseIcon.style.display = 'flex';
        dropDownMenu.style.width = '200px';
    }

    // Close wastEradicat platform dropdown menu
    function closePlatformDropdown() {
        platformMenuIcon.style.display = 'flex';
        platformCloseIcon.style.display = 'none';
        dropDownMenu.style.width = '0px';
    }

    
    // MENU, AUTHORIZATION BUTTONS FUNCTIONALITY
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    const menuDropdown = document.getElementById('menuDropdown');

    // Handling of document click events
    document.addEventListener('click', (e) => {
        if (e.target.id === 'platformMenuIcon') { // Open wastEradict platform dropdown menu
            openPlatformDropdown();
        }
        if (e.target.id === 'platformCloseIcon') { // Closing wastEradict platform dropdown menu 
            closePlatformDropdown();
        } 
        if (e.target.id === 'accountInfo') { // Navigating to the profile page
            window.location.href = '/profile';
        }
        if (e.target === menuIcon) { // Open dropdown menu
            openDropdown();
        }
        if (e.target === closeIcon) { // Closing dropdown menu 
            closeDropdown();
        }
        if (e.target.id === 'loginFormBtn') { // Open login form
            window.location.href = '/login';
        }
        if (e.target.id === 'signupFormBtn') { // Open signup form
            window.location.href = '/signup';
        }
        if (e.target.classList.contains('navigationLink')) {
            closeDropdown();
            e.stopPropagation();
        }
        if (e.target.id === 'continue') {
            const firstSignupPage = document.getElementById('firstSignupPage');
            const lastSignupPage = document.getElementById('lastSignupPage');
            const formHeading = document.getElementById('createAccountHeading');
            firstSignupPage.style.display = 'none';
            lastSignupPage.style.display = 'flex';
            formHeading.innerHTML = `
                Finish up creating your account
            `;
        }
        if (e.target.id === 'backArrow') {
            const firstSignupPage = document.getElementById('firstSignupPage');
            const lastSignupPage = document.getElementById('lastSignupPage');

            lastSignupPage.style.display = 'none';
            firstSignupPage.style.display = 'flex';
        }
    });

    // Close dropdown when clicking outside of it
    window.addEventListener('click', (e) => {
        if (menuDropdown) {
            if(menuDropdown.style.display === 'flex' && !menuDropdown.contains(e.target) && e.target !== menuIcon){
                closeDropdown();
            }
        }
        
    });

    //  POPUP CONTAINER FOR USEFUL MESSAGES TO THE USER
    const popupContainer = document.createElement('div');
    const popup = document.createElement('div');
    popup.id = 'userPopup';

    // Function to create and show popup
    function createPopup() {
        popupContainer.classList.add("popupContainer", "column_flex_container_center");
        popup.innerHTML = `
            <h4 id="popupHeader">Head</h4>
            <p id="popupMessage">This is the popup box where the user will be getting their messages through.</p>
            <button id="popupOkBtn" onclick="closePopup()">OK</button>
        `;
        popup.classList.add("popup", "column_flex_container");
        popupContainer.appendChild(popup);
        document.body.appendChild(popupContainer);

        document.getElementById('popupOkBtn').addEventListener('click', closePopup);
        popupContainer.style.display = 'flex';
    }
    
    // Close popup
    function closePopup() {
        popupContainer.style.display = 'none';
    }

    // Update popup message
    function updatePopupMessage(newHeader, newMessage) {
        const popupHeaderElement = document.getElementById('popupHeader');
        const popupMessageElement = document.getElementById('popupMessage')
        popupHeaderElement.textContent = newHeader;
        popupMessageElement.textContent = newMessage;
    }
    
    // TOGGLING THE VISIBILITY OF PASSWORD
    const userPassword = document.getElementById('userPassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeSlashIcon = document.getElementById('eyeSlashIcon');

    if (eyeIcon && eyeSlashIcon) {
        eyeIcon.addEventListener('click', togglePasswordVisibility);
        eyeSlashIcon.addEventListener('click', togglePasswordVisibility);
    }
    // Function to toggle password visibility
    function togglePasswordVisibility() {
        const type = userPassword.getAttribute('type') === 'password' ? 'text' : 'password'; // If password, toggle to text and if text, toggle to password
        userPassword.setAttribute('type', type);

        // Toggle visibility icon
        if (type === 'password') {
            eyeIcon.style.display = 'inline-block';
            eyeSlashIcon.style.display = 'none';
        } else {
            eyeIcon.style.display = 'none';
            eyeSlashIcon.style.display = 'inline-block';
        }
    }
    

    //----------------------------JAVASCRIPT COMMUNICATING WITH THE BACKEND----------------------------------

    // SIGNUP FUNCTIONALITY
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Ensure that user chooses a role before submitting the signup form
            const role = document.getElementsByName('roleChoice');
            let isChecked = false;

            for (const radio of role) {
                if (radio.checked) {
                    isChecked = true;
                    break;
                }
            }

            if (!isChecked) {
                alert('Please choose a role');
                return;
            }

            const formData = new FormData(signupForm);
            const username = formData.get('username');
            const email = formData.get('email');
            const password = formData.get('password');
            const phone = formData.get('phone');
            const roleChoice = formData.get('roleChoice');

            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password, phone, roleChoice })
                });

                const data = await response.json(); // The resultant data of the response

                if (response.ok) {
                    createPopup();
                    updatePopupMessage('Congratulations', 'Registration successful. You can now login to your account');
                    document.getElementById('popupOkBtn').addEventListener('click', () => {
                        window.location.href = '/login';
                    }, { once: true });
                } else{
                    // Clear previous error messages
                    const usernameError = document.getElementById('usernameError');
                    const emailError = document.getElementById('emailError');

                    usernameError.textContent = '';
                    emailError.textContent = '';

                    if(data.errors) {
                        // Check for specific errors for username or email
                        data.errors.forEach(error => {
                            if (error.msg === 'Username already exists') {
                                usernameError.textContent = error.msg;
                            }
                            if (error.msg === 'Email already exists') {
                                emailError.textContent = error.msg;
                            }
                        });
                    } 
                } 

            } catch (err) {
                console.log(`An error occurred: ${err}`);
                alert('An error occurred. Please try again later.');
            }
        });
    } // The end of the signup functionality


    // LOGIN FUNCTIONALITY
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');
    
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                if (response.ok) {
                    alert('Login successful');
                    window.location.href = '/';
                } else {
                    alert('Login failed. Ensure to enter a valid name and the correct password');
                }
            } catch (error) {
                console.error('An error occured!', error);
            }
        }); // The end of the login functionality
    }

    
    // LOGOUT FUNCTIONALITY
    const logout = document.getElementById('logout');
    if (logout) {
        logout.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/logout', {
                    method: 'POST'
                });
                if (response.ok) {
                    createPopup();
                    updatePopupMessage('Bye!', 'You have successfully logged out');
                    document.getElementById('popupOkBtn').addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = '/login';
                        history.replaceState(null, null, '/login');
                    });
                } else {
                    alert('An error occurred in loging out.');
                }
            } catch (error) {
                console.error('An error occured:', error)
            }
        }); 
    }
    
    // ADD EVENT LISTENER TO PROFILE SPAN FOR NAVIGATION
    const profileSpan = document.getElementById('userInfo');
    if (profileSpan) {
        profileSpan.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/profile';


            // FUNCTION TO FETCH THE USER INFO TO BE DISPLAYED IN THEIR PROFILE
            async function fetchUserData() {
                try {
                    const response = await fetch('/profile/userData', {
                        method: 'GET',
                        credentials: "same-origin"
                    });
                    console.log('Response status:', response.status);
                    console.log('Content-Type:', response.headers.get('content-type'));

                    if (response.status === 401) {
                        // alert('You are not logged in. Please head on login page');
                        // window.location.href = '/login';
                    }
                    if (response.status === 500) {
                        alert('An error occured fecthing user data');
                    }
                    if (response.status === 404) {
                        alert('The user is not found');
                    }
                    if (!response.ok) {
                        throw new Error(`Failed to fetch user profile:, ${response.status}`);
                    }
                    const user = await response.json();
                    console.log('User data:', user);

                    // Display user data in the profile page
                    document.getElementById('profileName').textContent = user.username;
                    document.getElementById('profileEmail').textContent = user.email;
                    document.getElementById('profilePhone').textContent = user.phone;
                    document.getElementById('profileRole').textContent = user.role;
                    document.getElementById('profileDate').textContent = user.createdAt;
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }

            // Check if the current page is the profile page and fetch user data
            if (window.location.pathname === '/profile') {
                fetchUserData();
            }  
        });
    }
    

    // THE PLATFORM MAP AND ITS FUNCTIONALITIES
// Initialize the map, centered on Kenya, with a high zoom level
const map = L.map('map').setView([-1.286389, 36.817223], 10);

// Load tiles from a public tile server with higher max zoom
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, // Allow higher zoom levels
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Orange dot icon for all markers
const orangeIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
});

// Locate the user with a higher zoom level
map.locate({ setView: true, maxZoom: 18 });

function onLocationFound(e) {
    const userMarker = L.marker(e.latlng, {icon: orangeIcon}).addTo(map)
        .bindPopup("You are here").openPopup();
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Fetch existing pins from the server
fetch('/api/pins')
    .then(response => response.json())
    .then(pins => {
        pins.forEach(pin => {
            addPinToMap(pin);
        });
    });

// Add pin functionality
map.on('click', function(e) {
    const description = prompt("Enter a description for your pin:");
    const pinUser = prompt("Enter your username:");
    if (description && pinUser) {
        fetch('/api/pin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lattitude: e.latlng.lat,
                longitude: e.latlng.lng,
                description: description,
                pinUser: pinUser
            })
        }).then(response => response.json())
          .then(pin => {
              addPinToMap(pin);
          });
    }
});

function addPinToMap(pin) {
    const marker = L.marker([pin.lattitude, pin.longitude], {icon: orangeIcon}).addTo(map)
        .bindPopup(`
            ${pin.pinUser}: ${pin.description}
            <br>
            <button onclick="unpinLocation(${pin.pinId}, this)">Unpin</button>
        `);
    marker.pinId = pin.pinId;
}

window.unpinLocation = function(pinId, button) {
    fetch(`/api/pin/${pinId}`, {
        method: 'DELETE'
    }).then(response => response.json())
      .then(result => {
          if (result.success) {
              map.eachLayer(layer => {
                  if (layer instanceof L.Marker && layer.pinId === pinId) {
                      map.removeLayer(layer);
                  }
              });
          } else {
              alert('Failed to unpin location');
          }
      });
};
    
}); // DOMContentLoaded function
