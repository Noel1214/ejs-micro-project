// export {};
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    connectionLimit: 1,
    password: process.env.password,
    database: process.env.database,
});
export default pool;
