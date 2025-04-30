import "dotenv/config";
import cors from "cors";
import express from "express";
import userRoutes from "./routes/users.js";

const app = express();

app.use(cors({ origin: process.env.LOCAL_URL }));

app.use(express.json());

app.use("/users", userRoutes);

const PORT = process.env.port || 8080;
app.get("/", (req, res) => {
  res.send("working");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
