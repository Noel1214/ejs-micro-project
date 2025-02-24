import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import pool from "./db.js";
import nodeCrypto from "crypto";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(process.cwd);

// app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [data] = await connection.query("select * from shortend_urls");
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    connection.release();
    res.render("index", { urls: data, currentPath: fullUrl });
  } catch (error) {
    console.log(error);
  }
});

app.post("/geturl", async (req, res) => {
  const { url } = req.body;

  const connection = await pool.getConnection();
  const shortCode = nodeCrypto.randomBytes(3).toString("hex");

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
