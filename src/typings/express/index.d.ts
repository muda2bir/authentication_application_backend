import { UserDocument } from "../../database/Schemas/user";
declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
