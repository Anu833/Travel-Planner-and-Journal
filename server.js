const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Anushka@833',
    database: 'travel_app_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.post('/api/bookRoom', (req, res) => {
    const { guest_id, room_number, check_in_date, check_out_date, adult, children } = req.body;

    const query = 'INSERT INTO room_bookings (guest_id, room_number, check_in_date, check_out_date, adult, children) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [guest_id, room_number, check_in_date, check_out_date, adult, children], (err, results) => {
        if (err) {
            console.error('Error booking room:', err);
            res.status(500).json({ message: 'Error booking room' });
            return;
        }
        res.status(201).json({ message: 'Room booked successfully' });
    });
});

// Other endpoints and configurations

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
