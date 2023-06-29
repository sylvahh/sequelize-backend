import { Model, DataType, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import environments from '../config/environments';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.RefreshToken = User.hasOne(models.RefreshToken);
      User.Roles = User.hasMany(models.Role);
    }
    static async hashPassword(password) {
      return bcrypt.hash(password, environments.saltRounds);
    }

    static async createNewUser({
      email,
      username,
      password,
      firstName,
      lastName,
      roles,
      refreshToken,
    }) {
      return sequelize.transaction(() => {
        let rolesToSave = [];
        if (roles && Array.isArray(roles)) {
          rolesToSave = roles.map((role) => ({ role }));
        }

        return User.create(
          {
            email,
            username,
            password,
            firstName,
            lastName,
            Roles: rolesToSave,
            RefreshToken: { token: refreshToken },
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
          notNull: {
            msg: 'Email is required',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 100],
            msg: 'Password must be at least 8 characters long',
          },
        },
      },

      username: {
        type: DataTypes.STRING(50),
        unique: true,
        validate: {
          len: {
            args: [3, 50],
            msg: 'Username must contain between 3 to 50 characters',
          },
        },
      },
      firstName: {
        type: DataTypes.STRING(50),
        unique: false,
        validate: {
          len: {
            args: [3, 50],
            msg: 'First name must contain between 3 to 50 characters',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING(50),
        unique: false,
        validate: {
          len: {
            args: [3, 50],
            msg: 'Last name must contain between 3 to 50 characters',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: { attributes: { exclude: ['password'] } },
      scopes: {
        withPassword: { attributes: { include: ['password'] } },
      },
    }
  );

  User.prototype.comparePasswords = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  // hash password before save
  User.beforeSave(async (user, options) => {
    if (user.password) {
    const hashedPassword = await User.hashPassword(user.password);
    user.password = hashedPassword;
    }
  });

  User.afterCreate((user, options) => {
    delete user.dataValues.password;
  });
  return User;
};
