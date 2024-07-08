import multer from "multer";
import { Request, Response } from "express";

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    const allowFileTypes = ["image/jpg", "image/png", "image/jpeg"];

    if (!allowFileTypes.includes(file.mimetype)) {
      cb(new Error("This filetype is not accepted"));
      return;
    }
    cb(null, "./src/uploads");
  },

  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export { multer, storage };
