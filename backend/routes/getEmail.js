import express from 'express'
import { getNurses } from '../controllers/userController.js';
import { autheticate } from '../middlewares/autheticateToken.js';

const emailRouter= express.Router();

emailRouter.get("/email", autheticate, getNurses);

export default emailRouter;
