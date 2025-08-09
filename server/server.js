import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./src/config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

//Database Conecct
