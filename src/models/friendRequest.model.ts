import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/mysql";
import User from "./user.model";

interface FriendRequestAttributes {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: string;
  created_at: Date;
}

interface FriendRequestCreationAttributes
  extends Optional<FriendRequestAttributes, "id" | "created_at"> {}

class FriendRequest
  extends Model<FriendRequestAttributes, FriendRequestCreationAttributes>
  implements FriendRequestAttributes
{
  public id!: number;
  public sender_id!: number;
  public receiver_id!: number;
  public status!: string;
  public created_at!: Date;
}

FriendRequest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    status: { type: DataTypes.STRING(20), defaultValue: "pending" },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "friend_requests", timestamps: false }
);

User.hasMany(FriendRequest, { as: "sentRequests", foreignKey: "sender_id" });
User.hasMany(FriendRequest, {
  as: "receivedRequests",
  foreignKey: "receiver_id",
});
FriendRequest.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
FriendRequest.belongsTo(User, { as: "receiver", foreignKey: "receiver_id" });

export default FriendRequest;
