import express from 'express'
import { getCurrentUser } from '../controllers/userController.js';
import { autheticate } from '../middlewares/autheticateToken.js';

const emailRouter= express.Router();

emailRouter.get("/email", autheticate, getCurrentUser);

export default emailRouter;
