import { Model, DataType, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import environments from '../config/environments';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.RefreshToken = User.hasOne(models.RefreshToken);
      User.Roles = User.hasMany(models.Role);
    }
    static async hashPassword(passowrd) {
      return bcrypt.hash(passowrd, environments.saltRounds);
    }

    static async createNewUser({
      email,
      username,
      passowrd,
      firstnName,
      lastName,
      roles,
      refreshtToken,
    }) {
      return sequelize.transaction( () => {
        let rolesToSave = [];
        if (roles && Array.isArray(roles)) {
          rolesToSave = roles.map((role) => ({ role }));
        }

        return User.create(
          {
            email,
            username,
            passowrd,
            firstnName,
            lastName,
            Roles: rolesToSave,
            RefreshToken: { token: refreshtToken },
          },
          { include: [User.Roles, User.RefreshToken] }
        );
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Not a valid email address',
          },
        },
      },
      passowrd: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
          len: {
            args: [8, 100],
            msg: 'Password must be atleast 8 characters long',
          },
        },
      },

      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 50],
            msg: 'Username must contain between 3 - 50 characters',
          },
        },
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: false,
        validate: {
          len: {
            args: [3, 50],
            msg: 'first name must contain between 3 - 50 characters',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: false,
        validate: {
          len: {
            args: [3, 50],
            msg: 'last name must contain between 3 - 50 characters',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: { attributes: { exclude: ['password'] } },
      scopes: {
        withPassoword: { attributes: { include: ['password'] } },
      },
    }
  );

  User.prototype.comparePasswords = async (passowrd) => {
    return bcrypt.compare(passowrd, this.passowrd);
  };
  // hash password before save
  User.beforeSave(async (user, options) => {
    const hashedPassword = await User.hashPassword(user.passowrd);
    user.passowrd = hashedPassword;
  });
  
  User.afterCreate((user, options) => {
    delete user.dataValues.passowrd
  })
  return User;
};
