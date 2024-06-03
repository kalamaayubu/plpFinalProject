// THE SERVER
const express = require('express');
const session = require('session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const { check, validationResults } = require('express-validator');
const dotenv = require('dotenv'); // A module to load environment variables from a .env file

const app = express();
dotenv.config() // Load environment variables from the .env file into provess.env
const PORT = process.env.PORT || 3000; 



