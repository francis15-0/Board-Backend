import pool from "../db/db";


async function initDatabase() {
    try {
        console.log("Initializing Database...")
        await pool.query(`
            CREATE TABLE IF NOT EXISTS boards(
            id VARCHAR(36) PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
            `);

        console.log("✅ Boards table ready")
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}