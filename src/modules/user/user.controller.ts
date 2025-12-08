import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
 console.log(req.body)
  try {
    const result = await userServices.createUser(req.body)
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

}



const getUser = async (req: Request, res: Response) => {
  try {
    const result =await  userServices.getUser()
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
}

const getSingleUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // res.send({message: "ÄPI is Cool..."})

  try {
    const result = await userServices.getSingleUser(req.params.id as string);
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
}

const updateUser = async (req: Request, res: Response) => {
  const { name, email, age } = req.body
  try {
    const result =await userServices.updateUser(name, email, age, req.params.id as string)

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
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result =await userServices.deleteUser(req.params.id as string)

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
}


export const userControllers = {
  createUser, 
  getUser,
  getSingleUser,
  updateUser,
  deleteUser
}