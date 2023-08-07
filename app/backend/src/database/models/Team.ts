import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import db from '.';

class TeamModelTable extends Model<
InferAttributes<TeamModelTable>,
InferCreationAttributes<TeamModelTable>
> {
  declare id: CreationOptional<number>;
  declare teamName: string;
}

TeamModelTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'teams',
    tableName: 'teams',
    timestamps: false,
    underscored: true,
  },
);

export default TeamModelTable;
