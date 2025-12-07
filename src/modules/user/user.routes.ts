import  express, { Request, Response }  from "express";
import { userControllers } from "./user.controller";

const router = express.Router()

//user router => create user
router.post("/", userControllers.createUser)
// get users
router.get("/", userControllers.getUser)
//get single user
router.get('/', userControllers.getSingleUser)
//update user
router.put('/', userControllers.updateUser)

export const userRoutes = router