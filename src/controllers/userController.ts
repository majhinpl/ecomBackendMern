import e, { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "please provide username, email, password",
      });
      return;
    }

    // Check if email or username already exists
    const [existingUser] = await User.findAll({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      res.status(400).json({
        message: "Email or username already exists",
      });
      return;
    }

    // if email and username are unique, create the user
    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 9),
      role: role,
    });

    res.status(200).json({
      message: "User register successfully",
    });
  }

  public static async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "please provide email, password",
      });
      return;
    }

    // check if user exist or not.
    const [data] = await User.findAll({
      where: {
        email: email,
      },
    });

    if (!data) {
      res.status(404).json({
        message: "user not found!",
      });
      return;
    }

    // check password

    const isMatched = bcrypt.compareSync(password, data.password);

    if (!isMatched) {
      res.status(403).json({
        message: "Invalid credentials",
      });
      return;
    }

    // generate token and send to user
    const token = jwt.sign({ id: data.id }, "process.env.JWT_SECRET", {
      expiresIn: "20d",
    });
    res.status(200).json({
      message: "login Successfully",
      data: token,
    });
  }
}

export default AuthController;
