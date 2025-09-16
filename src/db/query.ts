import pool from "./connection";

export const isEmailExist = async (email: String): Promise<boolean> => {
  const result = await pool.query(
    "SELECT 1 FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return (result.rowCount ?? 0) > 0;
};
