import { Types } from "mongoose";
import { User } from "../models/user.model";
import { SECRET } from "./env";
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const getUserData = (token) => {
  const user = jwt.verify(token, SECRET);
  return user;
};
