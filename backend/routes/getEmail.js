import express from 'express'
import { getUsers } from '../controllers/userController.js';
import { autheticate } from '../middlewares/autheticateToken.js';

const emailRouter= express.Router();

emailRouter.get("/email", autheticate, getUsers);

export default emailRouter;
