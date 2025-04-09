require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Save a solve time
app.post("/api/times", async (req, res) => {
  const { time } = req.body;
  if (typeof time !== "number") {
    console.log("Invalid time received:", time);
    return res
      .status(400)
      .json({ error: "Time is required and must be a number" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO times (time) VALUES ($1) RETURNING *",
      [time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all solve times
app.get("/api/times", async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM times ORDER BY created_at DESC LIMIT 20"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
