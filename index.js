require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const connection = await pool.getConnection();
  const [data] = await connection.query("select * from shortend_urls");
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  connection.release();
  res.render("index", { urls: data, currentPath: fullUrl });
});

app.post("/geturl", async (req, res) => {
  const { url } = req.body;

  const connection = await pool.getConnection();
  const shortCode = crypto.randomBytes(3).toString("hex");

  await connection.query(
    "insert into shortend_urls (url, short_code) values (?, ?)",
    [url, shortCode]
  );
  connection.release();

  res.redirect("/");
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
