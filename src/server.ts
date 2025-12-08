import express, { NextFunction, Request, Response } from "express";
import initDB, { pool } from "./config/db";
import config from "./config";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routers";
import { authRoutes } from "./modules/auth/auth.routes";


const app = express()
const port = config.port;

app.use(express.json())

//initializing DB
initDB()


app.get('/', logger, (req: Request, res: Response) => {
  res.send('Working !')
})

//users part
app.use("/users", userRoutes )

app.use('/todos', todoRoutes)

//auth routes
app.use("/auth", authRoutes)


app.use((req, res)=>{
  res.status(404).json({
    success:false,
    message:"Route not Found",
    path: req.path,
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
