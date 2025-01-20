const express = require("express");
const cors = require("cors");

const PORT = 8080;

const app = express();

app.use(cors());

app.get("/api/home", (req, res) => {
  res.json({ message: "Hello World!" });
});
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
