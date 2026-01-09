// src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,

      waitForConnections: true,
      connectionLimit: 5, // ⬅️ TURUNKAN (serverless best practice)
      queueLimit: 0,

      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    console.log("MySQL pool created");
  }

  return pool;
};

export default getPool;

// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// // Membuat pool koneksi MySQL (otomatis reuse koneksi)
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   waitForConnections: true, // Tunggu jika pool penuh
//   connectionLimit: 10, // Jumlah koneksi maksimum
//   queueLimit: 0, // Tidak ada limit antrian

// });

// export default pool;
