import { Pool } from "pg";
import config from "../config";

// pool neondb  connecting
export const pool = new Pool({
  connectionString: config.connection_string,
});
// connecting init db database
export const initDB = async () => {
  try {
    await pool.query(`
      
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      
      create_at TIMESTAMP DEFAULT NOW(),
      update_at TIMESTAMP DEFAULT NOW()
      )
             
      `);
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
  }
};
