import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import addRouter from "./routes/addRoutes.js"


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
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
  