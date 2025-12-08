import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response)=>{
    const {email, password} = req.body

     try {
        const result  = await authService.loginUser(email, password)
        res.status(200).json({
          succes: true,
          message: "Login Successfully",
          data: result
        })
    
      } catch (err: any) {
        res.status(500).json({
          succes: false,
          message: err.message
        })
      }

    


};
export const authController ={
    loginUser,
};