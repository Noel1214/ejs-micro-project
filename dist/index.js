var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
import express from "express";
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
// app.use(express.static("D:\Coding\ejs-micro-project\public"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield pool.getConnection();
        const [data] = yield connection.query("select * from shortend_urls");
        const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        connection.release();
        res.render("index", { urls: data, currentPath: fullUrl });
    }
    catch (error) {
        console.log(error);
    }
}));
app.post("/geturl", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    const connection = yield pool.getConnection();
    const shortCode = nodeCrypto.randomBytes(3).toString("hex");
    yield connection.query("insert into shortend_urls (url, short_code) values (?, ?)", [url, shortCode]);
    connection.release();
    res.redirect("/");
}));
app.listen(4000, () => {
    console.log("listening on port 4000");
});
