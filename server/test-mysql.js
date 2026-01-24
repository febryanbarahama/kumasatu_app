import mysql from "mysql2/promise";

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: "id-dci-web1982.main-hosting.eu",
      user: "u954978150_admin_kumasatu",
      password: "*YxuEcwtR1",
      database: "u954978150_kumasatu_db",
      port: 3306,
    });

    const [rows] = await conn.query("SELECT 1");
    console.log("✅ KONEKSI MYSQL BERHASIL:", rows);

    await conn.end();
  } catch (err) {
    console.error("❌ GAGAL KONEKSI MYSQL:");
    console.error(err.message);
  }
}

test();
