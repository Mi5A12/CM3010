const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const app = express();
const port = 5500;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Set up MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  database: "WHO", // Replace with your database name
  user: "root",
  password: "ma5a1409", // Replace with your MySQL root password
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Debugging: Test the database connection
db.getConnection()
  .then(conn => {
    console.log("Database connected successfully!");
    conn.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error("Database connection failed: ", err.message);
    process.exit(1); // Exit the process if the connection fails
  });

// Routes
const indexRoot = require("./routes/indexRoot");
app.use("/", indexRoot);
app.use("/api/mortality-by-age-group-region", require("./routes/indexQ1"));
app.use("/api/mortality-by-age-group-in-regions", require("./routes/indexQ2"));
app.use("/api/mortality-gender-differences", require("./routes/indexQ3"));
app.use("/api/yearly-mortality-by-country", require("./routes/indexQ4"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});