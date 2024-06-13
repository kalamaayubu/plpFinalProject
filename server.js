// THE SERVER
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const path = require('path');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv'); // A module to load environment variables from a .env file
// Debugging modules
const morgan = require('morgan'); // A module for HTTP request logging

const app = express();

dotenv.config() // Load environment variables from the .env file into provess.env
const PORT = process.env.PORT || 3000; 
app.use(morgan('dev')); // Add Morgan middleware for HTTP request logging
// app.use(expressDebug({})); // Use the express-debug middleware


// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));



// DEFINING ROUTES
// Public routes
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'landing.html'));
});
// Signup page route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'signup.html'));
});
// Login page route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});
// About page route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'about.html'));
});

// Protected routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'wasteradict.html'));
});
app.get('/notifications', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'notifications.html'));
});
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
});
app.get('/help', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'help.html'));
});


// Middleware to pass incoming JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


// Create MySQL connection
const connection = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Checking the MySQL connection
connection.connect((err) => {
    if (err) {
        return console.error(`Error connecting to MySQL database ${err.stack}`);
    }
    console.log(`Connected to MySQL as id ${connection.threadId}`);
});


// Session Middleware Configuration
app.use(session({
    secret: 'b4|t8#9q@y/ug79&yg9*0t9!t8~t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 15 * 60 * 1000 // Session expires after 15 minutes of inactivity
    }
}));


// OBJECT REPRESENTING USER-RELATED DATABASE OPERATIONS
const User = {
    tableName: 'users',
    createUser: (newUser, callback) => {
        connection.query(`INSERT INTO ${User.tableName} SET ?`, [newUser], callback);
    },
    getUserByEmail: (email, callback) => {
        connection.query(`SELECT * FROM ${User.tableName} WHERE email = ?`, [email], callback);
    },
    getUserByUsername: (username, callback) => {
        connection.query(`SELECT * FROM ${User.tableName} WHERE username = ?`, [username], callback);
    }
};

// SIGNUP ROUTE
app.post('/signup', [
    // Validate username and email
    check('username').trim().notEmpty().withMessage('Username must be alphanumerical'),
    check('email').isEmail().withMessage('Please enter a valid email address'),
    check('password').notEmpty().withMessage('Password id required'),
    check('phone').trim().notEmpty().withMessage('Phone number is required'),
    check('roleChoice').trim().notEmpty().withMessage('You must choose a role'),

    // Custom validation to check if the username and the email is unique
    check('email').custom(async (value) => {
        const user = await User.getUserByEmail(value);
        if (user) {
            throw new Error('Email already exists');
        }
    }),
    check('username').custom(async (value) => {
        const user = await User.getUserByUsername(value);
        if (user) {
            throw new Error('Username already exists');
        }
    }),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create a new user object
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        role: req.body.roleChoice
    };

    // Insert a new user to the database
    User.createUser(newUser, (error, results, fields) => {
        if(error) {
            console.error(`Error inserting user: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        console.log(`Inserted a new user with id ${results.insertId}`);
        res.status(201).json(newUser);
    });
}); // The end of signup route functionality


// LOGIN ROUTE
app.post('/login', (req, res) => {
    const {username, password} = req.body; // Object destructuring to extract the username and password properties from the req.body object
    // Retrieving user from database
    connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results, fields) => {
        if (error) {
            return console.error('An error occurred:', error);
        }
        if (results === 0) {
            res.status(401).send('User does not exist');
        } 
        const user = results[0];

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if (isMatch) {
                // Store user in session
                req.session.userId = user.id;
                res.status(200).send('Login made successful');
            } else{
                res.status(401).send('Wrong password');
            }
        });
    });
});


// LOGOUT ROUTE
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logging out failed', err);
            res.status(500).send('Logout failed');
        } else {
            res.clearCookie('connect.sid'); // Clearing the session cookie
            res.status(200).send('Logged out successfully');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});