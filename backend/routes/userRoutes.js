import express from "express"
import {loginController,signupController,getNurses} from "../controllers/userController.js"
const nurseRouter=express.Router();

nurseRouter.post("/login",loginController);
nurseRouter.post("/signup",signupController)
nurseRouter.get("/nurses",getNurses);

export default nurseRouter;