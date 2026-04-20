import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'users', // Explicitly set the table name here
  timestamps: true, // Ensures it looks for createdAt/updatedAt
})
export class User extends Model {
  id: number = 1;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
