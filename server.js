import express from "express";

const app = express();

const PORT = process.env.port || 8080;
app.get("/", (req, res) => {
  res.send("working");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
