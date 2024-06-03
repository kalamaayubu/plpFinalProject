document.addEventListener('DOMContentLoaded', function() {
    //-----------------THE FRONTEND JAVASCRIPT---------------------------
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

    // Show the login modal
    window.showLogin = function() {
        document.getElementById('login-modal').style.display = 'block';
    };

    // Show the signup modal
    window.showSignup = function() {
        document.getElementById('signup-modal').style.display = 'block';
    };

    // Close the modal
    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    // Close modals when clicking outside of them
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // MENU BAR FUNCTIONALITY
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    const menuDropdown = document.getElementById('menuDropdown');

    document.addEventListener('click', (e) => {
        if (e.target === menuIcon) {
            openDropdown();
        }
        if (e.target === closeIcon) {
            closeDropdown();
        }
    });

    // Click events
    // Close the dropdown menu when navigating to another page
    menuDropdown.addEventListener('click', (e) => {
        if(e.target.classList.contains('navigationLink')){
            closeDropdown();
        }
        e.stopPropagation();
    });

    // Close dropdown when clicking outside of it
    window.addEventListener('click', (e) => {
        if(menuDropdown.style.display === 'flex' && !menuDropdown.contains(e.target) && e.target !== menuIcon){
            closeDropdown();
        }
    });

    // Open login form function
    const openLoginForm = () => {
        window.location.href = 'login.html';
    };
    // Open signup form function
    const openSignupForm = () => {
        window.location.href = 'signup.html';
    }
    document.getElementById('loginFormBtn').addEventListener('click', openLoginForm);
    document.getElementById('signupFormBtn').addEventListener('click', openSignupForm);
    

    // // Toggling the password visiblility
    // const passwordInput = document.getElementById('userPassword');
    //     passwordInput.addEventListener('input', () => {
    //         const eyeIcon = document.getElementById('eyeIcon');
    //         if (passwordInput.value !== '') {
    //             eyeIcon.style.display = 'block';
    //         } else{
    //             eyeIcon.style.display = 'none';
    //         }
    //     });



    //----------------------------JAVASCRIPT COMMUNICATING WITH THE BACKEND----------------------------------
    // Handling login form submission
    // const loginForm = document.getElementById('loginForm');
    // loginForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
        
        
    // })

});
