import express from "express"
import { createAccount, getNurses } from "../controllers/nurseAccountController.js";
import { autheticate } from "../middlewares/autheticateToken.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const createNurseAccountRouter = express.Router();

createNurseAccountRouter.post("/nurse_account", autheticate, requireRole(["admin"]), createAccount);
createNurseAccountRouter.get("/nurse_account", autheticate, requireRole(["admin"]), getNurses)

export default createNurseAccountRouter;
