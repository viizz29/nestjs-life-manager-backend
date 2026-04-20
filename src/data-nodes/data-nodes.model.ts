import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'data_nodes',
  timestamps: true,
})
export class DataNode extends Model {
  @PrimaryKey
  @Column
  userId!: number;

  @PrimaryKey
  @Column
  sn!: number;

  @Column
  parentSn!: number;

  @Column
  position!: number;

  @Column
  note!: string;
}
