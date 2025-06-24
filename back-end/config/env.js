// import dotenv from "dotenv";
const dotenv = require("dotenv");
dotenv.config();
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const SECRET = process.env.SECRET || "";
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "";
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN || "";
