import express from "express"
import {createReport,displayReport,updateReport} from "../controllers/reportController.js"
import { autheticate } from "../middlewares/autheticateToken.js"

const reportRouter = express.Router();

reportRouter.post("/create_report",autheticate,createReport)
reportRouter.get("/display_report",autheticate,displayReport)
reportRouter.put("/update_report/:id",autheticate,updateReport)

export default reportRouter;
