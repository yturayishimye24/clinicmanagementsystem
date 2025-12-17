import express from "express"
import {getRequests,createRequests,removeRequests,changeRequests} from "../controllers/requestController.js"
const requestRouter = express.Router();

requestRouter.get("/showRequests",getRequests)
requestRouter.post("/createRequests",createRequests)
requestRouter.delete("/removeRequests/:id",removeRequests)
requestRouter.put("/changeRequests/:id",changeRequests)

export default requestRouter;