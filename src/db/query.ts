import connectionPool from "./connection.js";
import bcrypt from "bcrypt";

export const isEmailExist = async (email: string): Promise<boolean> => {
  const result = await connectionPool.query(
    "SELECT 1 FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return (result.rowCount ?? 0) > 0;
};

export const createUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return connectionPool.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email", [
    email,
    hashedPassword,
  ]);
};
