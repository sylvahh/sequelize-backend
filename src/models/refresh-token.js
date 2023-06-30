import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  RefreshToken.init(
    { token: { type: DataTypes.STRING } },
    { sequelize, modelName: 'RefreshToken' }
  );
  return RefreshToken;
};
