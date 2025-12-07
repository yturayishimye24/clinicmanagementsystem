import express from "express"
import { autheticateMiddleware } from "../middlewares/autheticateToken"
import {Verify} from "../controllers/VerifyController.js"
const router = express.Router()

router.post("/verify",autheticateMiddleware,Verify)