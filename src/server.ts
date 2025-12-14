import express from 'express'
import pool from './db/db'
import bcrypt from 'bcrypt'
import cors from 'cors'
const server = express()

server.use(express.json())
server.use(express.json());
server.use(cors());
const salt = 10

server.get("/", (req, res) => {
    res.json({ message: "Server Running" })
})

server.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Email or password is empty" });

        }
        else {
            const hash = await bcrypt.hash(password, salt)
            const [row]: any = await pool.query("INSERT INTO users (username, email, password_hash) VALUES (?, ?)", [username, email, hash])
            if (row.insertId > 0) {
                return res.json({ message: "Account created Succesfully" });
            }

        }
    } catch (error) {
        console.error("This is the error ", error);
    }

})


server.post("/login", (req, res)=>{
    
})







server.listen('3000', () => {
    console.log("Server running on port 3000")
})