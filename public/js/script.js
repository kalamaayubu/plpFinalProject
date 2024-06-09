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

    // MENU, AUTHORIZATION BUTTONS FUNCTIONALITY
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    const menuDropdown = document.getElementById('menuDropdown');

    // Handling of document click events
    document.addEventListener('click', (e) => {
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
                    window.location.href = '/platform';
                } else {
                    alert('Login failed. Ensure to enter a valid name and the correct password');
                }
            } catch (error) {
                console.error('An error occured!', error);
            }
        }); // The end of the login functionality
    
    
    }
    
}); // DOMContentLoaded function
