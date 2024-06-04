// THE SERVER
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const path = require('path');
const { check, validationResults } = require('express-validator');
const dotenv = require('dotenv'); // A module to load environment variables from a .env file
const { table } = require('console');

const app = express();
dotenv.config() // Load environment variables from the .env file into provess.env
const PORT = process.env.PORT || 3000; 

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// DEFINING THE PUBLIC ROUTES
// Root route
app.get('/', (req, res) => {
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
// Contact page route
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'contact.html'));
});
// Resources page route
app.get('/resources',(req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'resources.html'));
});

// Middleware to pass incoming JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


// OBJECT REPRESENTING USER-RELATED DATABASE OPERATIONS
const User = {
    tableName: 'users',
    createUser: (newUser, callback) => {
        connection.query(`INSERT INTO ${User.tableName} SET  ?`, [newUser], callback);
    },
    getUserByUsername: (username, callback) => {
        connection.query(`SELECT * FROM ${User.tableName} WHERE username = ?`, [username], callback);
    },
    getUserByEmail: (email, callback) => {
        connection.query(`SELECT * FROM ${User.tableName} WHERE email = ?`, [email], callback);
    }
};


// SIGNUP ROUTE
app.post('/signup', [
    // Validate username and email
    check('username').trim().notEmpty().withMessage('Username must be alphanumerical'),
    check('email').isEmail(),

    // Custom validation to check if the username and the email is unique
    check('username').custom(async (value) => {
        const user = await User.getUserByUsername(value);
        if (user) {
            throw new Error('Username already exist');
        }
    }),
    check('email').custom(async (value) => {
        const user = await User.getUserByEmail(value);
        if (user) {
            throw new Error('Email already exist');
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
        password: hashedPassword
    };

    // Insert a new user to the database
    User.createUser(newUser, (error, results, fields) => {
        if (error) {
            console.error(`Error inserting user: ${error.message}`);
            return res.status(500).json({ error: error.message })
        }
        console.log(`Successful inserted a new user with the id ${results.insertId}`);
        return res.status(200).json(newUser);
    })
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});