import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express()
const port = 5000

app.use(express.json())


const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
})


const initDB = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id  SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

  await pool.query(`
      
      CREATE TABLE IF NOT EXISTS todos(
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
        )
      `)

}

initDB()

//logger middleware
 const logger=(req: Request, res: Response, next: NextFunction)=>{
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next();
}

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Working !')
})

//users crud
app.post("/user", async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  try {
    const result = await pool.query(`INSERT INTO users(name, email,age) VALUES($1 ,$2, $3)  RETURNING *`,
      [name, email, age]
    )
    res.status(200).json({
      succes: true,
      message: "Data inserted Successfully",
      data: result.rows[0]
    })

  } catch (err: any) {
    res.status(500).json({
      succes: false,
      message: err.message
    })
  }
  console.log(req.body);


  res.status(201).json({
    success: true,
    message: "Working",
    body: req.body
  });
});
// get all the users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`)
    res.status(200).json({
      success: false,
      message: "Users Retrieved successfully",
      data: result.rows,

    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    })
  }
})

//get user using id
app.get("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // res.send({message: "ÄPI is Cool..."})

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
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
    console.log(result.rows)

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    })
  }
})

//update user
app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email, age } = req.body
  try {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, age=$3 WHERE id=$4 RETURNING *`,
      [name, email, age, req.params.id]);

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


//delete user
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
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
