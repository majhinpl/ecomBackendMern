import {
  Column,
  Model,
  DataType,
  Table,
  AllowNull,
} from "sequelize-typescript";

@Table({
  tableName: "orderDetails",
  modelName: "OrderDetail",
  timestamps: true,
})
class OrderDetail extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;
}

export default OrderDetail;
