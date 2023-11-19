const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');

const app = express();

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ash@123456',
  database: 'travel_journal'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Multer configuration for file upload
const upload = multer({ dest: 'public/uploads/' }); //made change here, was just upload/

// Serve the 'public' directory for static files
app.use(express.static('public'));

app.set('view engine', 'ejs');

// Route to serve the HTML file
app.get('/create-journal', (req, res) => {
  res.sendFile(__dirname + '/create-journal.html');
});

app.get('/blog-single', (req, res) => {
  res.sendFile(__dirname + '/blog-single.html');
});

// Handle form submission
app.post('/submitEntry', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), (req, res) => {
  const { date, title, image1, image2, image3, content1, heading1, content2, quote, heading2, content3, content4} = req.body;

  const images = req.files;

  // Convert the date string to a JavaScript Date object
  const formattedDate = new Date(date);

  // Inserting data into MySQL database
  const sql =
    'INSERT INTO entries (date, title, image1, image2, image3, content1, heading1, content2, quote, heading2, content3, content4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(
    sql, [
      formattedDate, title, images.image1[0].filename, images.image2[0].filename, images.image3[0].filename, content1, heading1, content2, quote, heading2, content3, content4
    ],
    (err, result) => {
      if (err) throw err;
      console.log('Entry added to the database.');
      res.send('Entry added successfully!');
    }
  );
});


// Add this route to fetch all entries
app.get('/entries', (req, res) => {
    // Select all entries from the database
    const sql = 'SELECT * FROM entries';
    connection.query(sql, (err, results) => {
      if (err) throw err;
  
      // Send the entries as a JSON response
      res.json(results);
    });
  });


// Fetch a single entry by ID
app.get('/single-blog/:id', (req, res) => {
  const entryId = req.params.id;
  const sql = 'SELECT * FROM entries WHERE id = ?';
  connection.query(sql, [entryId], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
          res.status(404).send('Entry not found');
      } else {
          const entry = results[0];
          res.render('blog-single', { entry });
      }
  });
});

app.get('/journal-home', (req, res) => {
    // Fetch entries from the database
    const sql = 'SELECT * FROM entries';
    connection.query(sql, (err, entries) => {
      if (err) throw err;
  
      // Render the 'journal-home' template with entries
      res.render('journal-home', { entries });
    });
});
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
