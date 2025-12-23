import express from "express";
import pool from "./db/db";
import bcrypt from "bcrypt";
import cors from "cors";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import jwt from "jsonwebtoken";
import { requireAuth } from "./middleware/auth";
import { Request, Response } from "express";
import { AuthRequest } from "./middleware/auth";
import { TaskPatchBody } from "./types";

const server = express();

server.use(express.json());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
const salt = 10;

const jwt_secret: any = process.env.JWT_SECRET;
interface User {
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
      `select id, email, password_hash, username FROM users where email = ?`,
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
      { userName: user.username, userId: user.id, email: user.email },
      jwt_secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token: token,
      user: user.username,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

server.get("/boards", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user?.userId;

    const [rows] = await pool.query<RowDataPacket[]>(
      `select * from boards where user_id = ?`,
      [user]
    );
    return res.status(200).json({ boards: rows });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

server.post("/boards", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user?.userId; // store the user id
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is empty" });
    }
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO boards (user_id, title) VALUES(?, ?)`,
      [user, title]
    );
    if (result.affectedRows !== 1) {
      return res.status(400).json({ message: "Board creation failed" });
    }

    return res
      .status(201)
      .json({ message: "Board created", boardId: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
});

server.get(
  "/boards/:boardId",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const boardId = Number(req.params.boardId);
      const user = req.user?.userId;

      if (!Number.isInteger(boardId)) {
        return res.status(400).json({ message: "Invalid board id" });
      }

      const [rows] = await pool.query<RowDataPacket[]>(
        `select id, title, created_at FROM boards where id = ? And user_id = ?`,
        [boardId, user]
      );
      if (rows.length == 0) {
        return res.status(404).json({ message: "Board not found" });
      }
      return res.status(200).json({ board: rows });
    } catch (error) {
      return res.status(500).json({ message: "Internal sever error", error });
    }
  }
);
server.patch(
  "/boards/:boardId",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user?.userId;
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is empty" });
      }
      const boardId = Number(req.params.boardId);
      if (!Number.isInteger(boardId)) {
        return res.status(400).json({ message: "Invalid board id" });
      }
      const [rows] = await pool.query<ResultSetHeader>(
        `update boards set title = ? where id = ? and user_id = ?`,
        [title, boardId, user]
      );

      if (rows.affectedRows !== 1) {
        return res.status(400).json({ message: "Board not found" });
      }
      return res.status(200).json({ message: "Board renamed Succesfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal sever error", error });
    }
  }
);
server.delete(
  "/boards/:boardId",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user?.userId;
      const boardId = Number(req.params.boardId);
      if (!Number.isInteger(boardId)) {
        return res.status(400).json({ message: "Invalid board id" });
      }
      const [rows] = await pool.query<ResultSetHeader>(
        `DELETE FROM boards where id = ? and user_id = ?`,
        [boardId, user]
      );

      if (rows.affectedRows !== 1) {
        return res.status(400).json({ message: "Board not found" });
      }

      return res.status(200).json({ message: "Board deleted Succesfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal sever error", error });
    }
  }
);

server.get(
  "/boards/:boardId/task",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user?.userId;
      const boardId = Number(req.params.boardId);
      if (!Number.isInteger(boardId)) {
        return res.status(400).json({ message: "Invalid board id" });
      }
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT id, board_id, title, description, status from tasks WHERE id = ? and user_id = ?`,
        [boardId, user]
      );
      if (rows.length == 0) {
        return res.status(404).json({ message: "Board not found" });
      }
      return res.status(200).json({ tasks: rows });
    } catch (error) {
      return res.status(500).json({ message: "Internal sever error", error });
    }
  }
);
server.post(
  "/boards/:boardId/task",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const user = req.user?.userId;
    const { title, description, status } = req.body as TaskPatchBody;
    const taskId = Number(req.params.taskId);
    if (!Number.isFinite(taskId)) {
      return res.status(400).json({ error: "Invalid taskId" });
    }

    const update: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      update.push("title = ?");
      values.push(title);
    }

    if (description !== undefined) {
      update.push("description = ?");
      values.push(description);
    }
    if (status !== undefined) {
      update.push("status = ?");
      values.push(status);
    }

    if (update.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }
    
    values.push(taskId)
    values.push(user)
    const sql : string = `update tasks set ${update.join(", ")} where id = ? and user_id = ?`

    await pool.query<ResultSetHeader>(sql, values)
  }
);
server.delete(
  "/task/:taskId",
  requireAuth,
  async (req: AuthRequest, res: Response) => {}
);

server.listen("3000", () => {
  console.log("Server running on port 3000");
});
