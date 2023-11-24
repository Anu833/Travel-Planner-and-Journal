const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'arya1861@',
    database: 'travel_app_db'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Endpoint for login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).json({ message: 'Server error' });
            return;
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Endpoint for user registration
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ message: 'Registration failed' });
            return;
        }

        res.status(201).json({ message: 'Registration successful' });
    });
});


// Other endpoints and server configurations go here

// Endpoint to create a new trip
app.post('/api/trips', (req, res) => {
    console.log("I'm in post")
    const { username, dates, location, budget, journal } = req.body;
    console.log("I was never here")
    console.log(username)
    // Retrieve the user's ID based on the username
    const getUserIdQuery = 'SELECT id FROM users WHERE username = ?';
    connection.query(getUserIdQuery, [username], (err, results) => {
        if (err) {
            console.error('Error getting user ID:', err);
            res.status(500).json({ message: 'Error creating trip' });
            return;
        }
        
        if (err || results.length === 0) {
            console.log("I'm in length 0")
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const user_id = results[0].id;
        console.log("printing user id")
        console.log(user_id)
        // Insert the trip with the user_id into the trips table
        const insertTripQuery = 'INSERT INTO trips (user_id, dates, location, budget, journal) VALUES (?, ?, ?, ?, ?)';
        console.log("Values to be inserted:", user_id, dates, location, budget, journal); // Log values before insertion

        connection.query(insertTripQuery, [user_id, dates, location, budget, journal], (err, results) => {
            if (err) {
                console.error('Error creating trip:', err);
                res.status(500).json({ message: 'Error creating trip' });
                return;
            }
            res.status(201).json({ message: 'Trip created successfully' });
        });
    });
});




const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
