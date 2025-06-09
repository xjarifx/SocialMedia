import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/mysql";

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public username!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true, // Enables createdAt and updatedAt automatically
    createdAt: "created_at", // Maps to your column names
    updatedAt: "updated_at",
  }
);

export default User;
