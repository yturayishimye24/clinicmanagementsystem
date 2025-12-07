import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {createServer} from "http"
import userRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import addRouter from "./routes/addRoutes.js"
import { seed } from "./userSeed.js";


dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/users",addRouter)


connectDB();
seed();
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
  