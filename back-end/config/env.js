// import dotenv from "dotenv";
const dotenv = require("dotenv");
dotenv.config();
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const SECRET = process.env.SECRET || "";
