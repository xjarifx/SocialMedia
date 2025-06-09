import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || "socialmedia",
  process.env.MYSQL_USER || "root",
  process.env.PASSWORD || "",
  {
    host: process.env.HOST || "localhost",
    port: Number(process.env.PORT) || 3306,
    dialect: "mysql",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("MySQL connection error: ", error);
  }
})();
