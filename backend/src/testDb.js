const db = require("./config/db");

async function testConnection() {
    try {
        const [rows] = await db.query("SELECT 1 + 1 AS test");
        console.log("Database connected! Result =", rows[0].test);
    } catch (err) {
        console.error("Database connection failed:", err);
    }
}

testConnection();
