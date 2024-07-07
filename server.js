// THE SERVER
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const nodemailer = require('nodemailer'); // A module to send email(s) from the server
const crypto = require('crypto'); // In build node module to generate a secure token
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


// Configuring the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kalamaayubu913@gmail.com',
        pass: '#03k@la$h'
    }
});


// DEFINING ROUTES
// Public routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});
// Signup page route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'signup.html'));
});
// Login page route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});
// Forgot password page
app.get('/forgotPassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'forgotPass.html'));
});
// Reset password page
app.get('/resetPassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'resetPass.html'));
});
// About page route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'about.html'));
});
// Protected routes
app.get('/platform', (req, res) => {
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

// FORGOT PASSWORD ROUTE
app.post('/forgotPassword', async (req, res) => {
    const email = req.body.email;

    connection.query('SELECT email FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Query Error' });
        }
        if (result.length > 0) {
            const token = crypto.randomBytes(20).toString('hex');
            const expiration = Date.now() + 1800000; // Token exiring 30 minutes form now
            
            // Store token and expiration in the database
            const updateQuery = 'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE userId = ?';
            connection.query(updateQuery, [token, expiration, email], (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating token in database' });
                }

                const recoveryLink = `http://localhost:3000/resetPassword=${token}`;
                
                const mailOptions = {
                    from: 'kalamaayubu913@gmail.com',
                    to: email,
                    subject: 'Password Recovery',
                    text: `Hello,
                        You sent a password recovery request right?
                        Follow the link to reset your password:  `
                }; 

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.status(500).json({ message: 'Email sending failed'} );
                    } else {
                        res.json({ message: 'Password recovery link send to your email' });
                    }
                });
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});


// PASSWORD RESET ROUTE
app.post('/resetPassword', (req, res) => {
    const { token, newPassword } = req.body;
    const query = 'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?';

    connection.query(query, [token, Date.now()], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error' });
        }
        if (result.length > 0) {
            const email = result[0].email;
            const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex'); // Hash the new password
            const updatePasswordQuery = 'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE userId = ?';

            connection.query(updatePasswordQuery, [hashedPassword, email], (err, updatePasswordResult) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating password in the database' });
                } else {
                    res.status(200).json({ message: 'Password has been reset successfully'});
                }
            });
        } else {
            res.status(404).json({ message: 'Invalid or Expired token' });
        }
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


// ROUTE TO FETCH THE USER INFORMATION
app.get('/profile/userData', (req, res) => {
    const userId = req.session.userId;

    console.log('Session userId:', userId);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }

    connection.query('SELECT username, email, phone, role, createdAt FROM users WHERE userId = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ error: 'Error fetching user data' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = {
            username: results[0].username,
            email: results[0].email,
            phone: results[0].phone,
            role: results[0].role,
            createdAt: results[0].createdAt
        };

        res.json(userData);
    });
});


// ROUTE TO WORK WITH MAP PINS
app.get('/api/pins', (req, res) => {
    const query = 'SELECT * FROM pins';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/pin', (req, res) => {
    const { lattitude, longitude, description, pinUser } = req.body;
    const query = 'INSERT INTO pins (lattitude, longitude, description, pinUser) VALUES (?, ?, ?, ?)';
    connection.query(query, [lattitude, longitude, description, pinUser], (err, result) => {
        if (err) throw err;
        res.json({ pinId: result.insertId, lattitude, longitude, description, pinUser });
    });
});

app.delete('/api/pin/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pins WHERE pinId = ?';
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});