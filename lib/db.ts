import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,     // misalnya: "localhost" atau IP hosting
  user: process.env.DB_USER,     // username database
  password: process.env.DB_PASS, // password database
  database: process.env.DB_NAME, // nama database
});
