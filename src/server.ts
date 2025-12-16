import express from "express";
import pool from "./db/db";
import bcrypt from "bcrypt";
import cors from "cors";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import { requireAuth } from "./middleware/auth";
import { Request, response } from "express";
import { AuthRequest } from "./middleware/auth";



const server = express();

server.use(express.json());
server.use(express.json());
server.use(express.urlencoded({extended: true}))
server.use(cors());
const salt = 10;

const jwt_secret: any = process.env.JWT_SECRET;
interface User{
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

server.get("/", (req, res) => {
  res.json({ message: "Server Running" });
});

server.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Email or password is empty" });
    } else {
      const hash = await bcrypt.hash(password, salt);
      const [rows]: any = await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, hash]
      );
      if (rows.insertId > 0) {
        return res.json({ message: "Account created Succesfully" });
      }
    }
  } catch (error) {
    console.error("This is the error ", error);
  }
});

server.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Theres no Email or password" });
    }

    const [rows] = await pool.query<(User & RowDataPacket)[]>(
      `select id, password_hash, username FROM users where email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "That email does not exit" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "wrong user name or password" });
    }

    const token = jwt.sign(
      { userName: user.username, userId: user.id },
      jwt_secret
    );

    return res.status(200).json({
      token: token,
      user: user.username,
    });
  } catch (error) {
    return res.status(500).json(error)
  }
});


server.get('/board', requireAuth, (req:AuthRequest, res : any)=>{
    const user = req.user?.userId
    

    console.log(user)
    

})


server.listen("3000", () => {
  console.log("Server running on port 3000");
});
