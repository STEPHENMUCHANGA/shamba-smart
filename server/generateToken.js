import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: "12345", email: "example@test.com" },  // payload
  process.env.JWT_SECRET,                      // secret
  { expiresIn: "7d" }                          // token duration
);

console.log("Your JWT Token:");
console.log(token);
