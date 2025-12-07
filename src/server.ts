import express, { NextFunction, Request, Response } from "express";
import initDB, { pool } from "./config/db";
import config from "./config";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";


const app = express()
const port = config.port;

app.use(express.json())

//initializing DB
initDB()

//logger middleware


app.get('/', logger, (req: Request, res: Response) => {
  res.send('Working !')
})

//users part
app.use("/users", userRoutes )


//todos post
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1,$2) RETURNING *`, [user_id, title])
    res.status(201).json({
      success: true,
      message: "Todo Created",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      succes: false,
      message: err.message
    })
  }
})

//todos get
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result= await pool.query(`SELECT * FROM todos`)
    res.status(200).json({
      success: false,
      message: "Users Retrieved successfully",
      data: result.rows,})

    }catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
        details: err,
      })
    }
  })

  //todos update
app.put("/todos/:id", async (req: Request, res: Response) => {
  const { title, completed } = req.body
  try {
    const result = await pool.query(`UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *`,
      [title,completed, req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    } else {
      res.status(200).json({
        success: true,
        message: "User updated Successfully",
        data: result.rows[0],
      })
    }
    console.log(result.rows)

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    })
  }
})

//get single todos
app.get("/todos/:id", async(req: Request, res:Response)=>{
  try{  
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [req.params.id])

    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    } else {
      res.status(200).json({
        success: true,
        message: "User fetched Successfully",
        data: result.rows[0],
      })
    }

  }catch(err: any){
        res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    })
  }
})
  

//delete todos
app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `DELETE FROM todos WHERE id=$1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "todos not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todos Deleted Successfully",
      data: result.rows[0],
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});


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
