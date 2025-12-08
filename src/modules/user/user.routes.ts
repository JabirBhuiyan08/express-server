import  express, { Request, Response }  from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router()

//user router => create user
router.post("/", userControllers.createUser)
// get users
router.get("/",logger,auth("admin"), userControllers.getUser)
//get single user
router.get('/:id', userControllers.getSingleUser)
//update user
router.put('/:id', userControllers.updateUser)

export const userRoutes = router