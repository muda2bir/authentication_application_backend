import { Request, Response, NextFunction } from "express";

export default function isUserAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user) next();
  else {
    res.status(401).json({ status: "error", message: "Unauthorized!" });
  }
}
