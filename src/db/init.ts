import pool from "../db/db";

export async function initDatabase() {
  try {
    console.log("Initializing Database...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("✅ user table ready");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS boards(
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
      `);
      
      console.log("✅ boards table ready");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks(
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      board_id INT UNSIGNED NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('todo','doing','done') DEFAULT 'todo',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE

      )
      
      `);

    console.log("✅ tasks table ready");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

initDatabase();
