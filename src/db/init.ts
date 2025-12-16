import pool from "../db/db";


async function initDatabase() {
    try {
        console.log("Initializing Database...")
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

            
        console.log("✅ user table ready")
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}

initDatabase()
