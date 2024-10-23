const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type"
}));

const port = 3000;
//Parse the requests of content-type 'App/json'
app.use(bodyParser.json());

//Create the mysql connection 
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password123',
    database: 'Users'
})

//Connect to MySQL
db.connect((err) => {
    if(err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    // Query to get tables from the current database
    db.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.error('Error fetching tables: ', err);
            return;
        }

        // Get the name of the first table, you can adjust this as needed
        const tableName = results[0] ? Object.values(results[0])[0] : 'No tables found';

        // Log the database and table name
        console.log(`Connected to MySQL with database: ${db.config.database} and table: ${tableName}`);
    });
});

// Get all users
app.get('/', (req, res) => {
    const sqlQuery = 'SELECT * FROM customers';

    db.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Error fetching data from customers table: ', err);
        res.status(500).send('Error retrieving data');
        return; 
      } 
      else {
        console.log('Query Results: ', results);
        //Send the results as a JSON response
        res.json(results);
      }
       
    });
  });

  //POST route to add a new customer to the database
  app.post('/add-customer', (req, res) => {
    const {email, password, Name} = req.body;               //Assuming user will send "name", "email", "password"
    //check if data is provided
    if(!email || !password || !Name || password.length > 20) {
        return res.status(400).send('Name, email and password are required');
    }
     // Check if email or password already exists in the database
     const checkQuery = 'SELECT * FROM customers WHERE email = ? OR password = ?';

    db.query(checkQuery, [email, password], (err, results) => {
      if(err) {
        console.error('Error checking for existing customer:', err);
        return res.status(500).send('Server error while checking for existing customer');
      }
      if(results.length > 0) {
        //Check if the email or password is duplicated
        const duplicate = results[0].email === email ? 'Email' : 'Password';
        console.log(`Duplicate ${duplicate} found: ${duplicate === 'Email' ? email : password}`);
        return res.status(400).send(`${duplicate} already exists`);
      }
    })

    const insertQuery = 'INSERT INTO customers (email, password, Name) VALUES (?, ?, ?)';

    db.query(insertQuery, [email, password, Name], (err, result) => {
        if(err) {
            console.error('Error inserting data into customers table: ', err);
            return res.status(500).send('Error adding User');
        }
        res.send('User added successfully!');
    })
  })

  app.delete('/delete-user/email', (req, res) => {
    const userEmail = req.params.email;

    const sqlQuery = 'DELETE FROM customers WHERE email = ?';
    db.query(sqlQuery, [userEmail], (err, results) => {
      if(err) {
        console.log("Error deleting user: ", err);
        return res.status(500).send("Error deleting user");
      }
       // Check if any rows were affected
       if(results.affectedRows === 0) {
        return res.status(404).send('User not found');  //User not found
       }
       
       res.send('User deleted successfully');
    })

  })

//Start a server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = db;