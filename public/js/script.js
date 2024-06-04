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
    document.getElementById('loginFormBtn').addEventListener('click', () => {
        window.location.href = '/login';
    });

    // Open signup form function
    document.getElementById('signupFormBtn').addEventListener('click', () => {
        window.location.href = '/signup';
    });

    //----------------------------JAVASCRIPT COMMUNICATING WITH THE BACKEND----------------------------------

    // Signup functionality
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            if (response.ok) {
                alert('Registration made successful');
            } else {
                alert('Registration failed');
            }
        } catch (err) {
            console.error(`An error occured: ${err}`);
            alert('An error occured. Please try again later.')
        }
    });

}); // DOMContentLoaded function
