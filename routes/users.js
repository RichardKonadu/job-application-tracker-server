import connection from "../utils/connection.js";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

const SALT_ROUNDS = 8;

router.post("/register", async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "you must provide a name, email and password" });
  }
  try {
    const findUserSql = `SELECT * FROM users WHERE email = ?`;

    const [userResult] = await connection.query(findUserSql, [req.body.email]);
    if (userResult.length > 0) {
      return res.status(409).json({ msg: "email already in use" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const sql = `INSERT INTO users
               set name = ?, email = ?, password = ?`;

    const [result] = await connection.query(sql, [
      req.body.name,
      req.body.email,
      hashedPassword,
    ]);

    res.status(201).json({ msg: `User created with ID ${result.insertId}` });
  } catch (error) {
    res.status(501).json(error.message);
  }
});

export default router;
