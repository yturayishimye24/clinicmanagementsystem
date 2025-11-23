import express from "express"
import { getAllPatients,getOnePatient,createPatient,deletePatient,updatePatient } from "../controllers/addController.js";  

const addRouter = express.Router();

addRouter.get("/",getAllPatients);
addRouter.get("/:id",getOnePatient);
addRouter.post("/create",createPatient);
addRouter.put("/:id",updatePatient);
addRouter.delete("/:id",deletePatient);

export default addRouter

