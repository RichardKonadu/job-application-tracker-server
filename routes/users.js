import connection from "../utils/connection.js";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authorise from "../middleware/auth.js";

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

router.post("/login", async (req, res) => {
  if (!req.body.email || req.body.password) {
    return res
      .status(400)
      .json({ msg: "You must include a email and password" });
  }

  try {
    const sql = `SELECT *
                     FROM users 
                     WHERE email = ?`;
    const [user] = await connection.query(sql, [req.body.email]);

    const result = await bcrypt.compare(req.body.password, user[0].password);

    if (!result) {
      return res
        .status(403)
        .json({ msg: "username/password combination is incorrect" });
    }
    const token = jwt.sign(
      {
        id: user[0].id,
        sub: user[0].email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ authToken: token });
  } catch (error) {
    res.status(400).json({ msg: "user not found" });
  }
});

router.get("profile", authorise, async (req, res) => {
  try {
    const sql = `SELECT *
                     FROM users
                     where id = ?`;
    const [user] = await connection.query(sql, [req.token.id]);

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ msg: "can't fetch user profile" });
  }
});

router.delete("/id", authorise, async (req, res) => {
  const userID = req.token.id;

  const sql = `DELETE from users where users.id = ?`;

  try {
    const [results] = await connection.query(sql, [userID]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ msg: `no user with ID ${userID} found` });
    }
    res.json({ msg: `user with id ${userID} has been deleted` });
    res.status(204).end();
  } catch (error) {
    res.status(500).json(eror);
  }
});
export default router;
