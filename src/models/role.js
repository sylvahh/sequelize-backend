import { Model, DataType, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsTo(models.User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  Role.init({ role: { type: DataTypes.STRING } }, { sequelize, modelName: 'Role' });
  return Role;
};
