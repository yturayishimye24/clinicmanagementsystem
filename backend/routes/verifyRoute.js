import express from "express"
import { autheticate } from "../middlewares/autheticateToken.js"
import {Verify} from "../controllers/VerifyController.js"
const router = express.Router()

router.get("/verify",autheticate,Verify)

export default router;