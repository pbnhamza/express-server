import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { Pool, Query } from "pg";
import config from "./config";

const app: Application = express();
const port = config.port;

app.use(express.json());
// pool neondb  connecting
const pool = new Pool({
  connectionString: config.connection_string
});

// connecting init db database
const initDB = async () => {
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
initDB();
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Server",
    author: "next level",
  });
});

// create post font end to server
app.post("/api/users", async (req: Request, res: Response) => {
  //   console.log(req.body);
  const { name, email, password, age } = req.body;
  // pool insert
  try {
    const result = await pool.query(
      `
  INSERT INTO users(name, email, password, age) 
  VALUES($1,$2,$3,$4)
  RETURNING *  
  `,
      [name, email, password, age],
    );
    // console.log(result);

    res.status(201).json({
      success: true,
      message: "Use Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});
// post date get all data from database

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
    SELECT * FROM users    
    `);
    res.status(200).json({
      success: true,
      message: "Users Retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});
// get single data form neonDB

app.get("/api/users/:id", async (req: Request, res: Response) => {
  // id for prams
  const { id } = req.params;
  // console.log(req.params);
  // console.log(id);
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      `,
      [id],
    );
    // console.log(result.rows[0]);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "Users Retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});
// users update

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;
  // console.log("id", id);
  // console.log(name, password, age, is_active);
  try {
    const result = await pool.query(
      `
    UPDATE users
    SET
    name=COALESCE($1,name),
    password=COALESCE($2,password),
    age=COALESCE($3,age),
    is_active=COALESCE($4,is_active)
    WHERE id=$5
    RETURNING *
    `,
      [name, password, age, is_active, id],
    );
    // console.log(result);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users Successfully update",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

//Delete user
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      
      DELETE FROM users WHERE id=$1
      
      
      `,
      [id],
    );
    // console.log(result);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users Successfully delete ",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
