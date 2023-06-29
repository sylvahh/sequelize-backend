import TestHelpers from '../test-helpers';
import models from '../../src/models';

describe('User', () => {
  beforeAll(async () => {
    await TestHelpers.startDb();
  });

  afterAll(async () => {
    await TestHelpers.stopDb();
  });

  beforeEach(async () => {
    await TestHelpers.syncDb();
  });

  describe('static methods', () => {
    describe('hashPassword', () => {
      it('should hash the password passed in the arguments', async () => {
        const { User } = models;
        const password = 'Test123#';
        const hashedPassword = await User.hashPassword(password);
        expect(password).not.toEqual(hashedPassword);
      });
    });

    describe('createNewUser', () => {
      it('should create a new user successfully', async () => {
        const { User } = models;
        const data = {
          email: 'test@example.com',
          password: 'Test123#',
          roles: ['admin', 'customer'],
          username: 'test',
          firstName: 'David',
          lastName: 'Armendariz',
          refreshToken: 'test-refresh-token',
        };
        const newUser = await User.createNewUser(data);
        const usersCount = await User.count();
        expect(usersCount).toEqual(1);
        expect(newUser.email).toEqual(data.email);
        expect(newUser.password).toBeUndefined();
        expect(newUser.username).toEqual(data.username);
        expect(newUser.firstName).toEqual(data.firstName);
        expect(newUser.lastName).toEqual(data.lastName);
        expect(newUser.RefreshToken.token).toEqual(data.refreshToken);
        expect(newUser.Roles.length).toEqual(2);
        const savedRoles = newUser.Roles.map((savedRole) => savedRole.role).sort();
        expect(savedRoles).toEqual(data.roles.sort());
      });

      it('should error if we create a new user with an invalid email', async () => {
        const { User } = models;
        const data = {
          email: 'test',
          password: 'Test123#',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);
        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('Not a valid email address');
        expect(errorObj.path).toEqual('email');
      });
      it('should error if password entered is not 8 charaters long', async () => {
        const { User } = models;

        const data = {
          email: 'test@example.com',
          password: 'test',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);
        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('Password must be at least 8 characters long');
        expect(errorObj.path).toEqual('password');
      });

      it('should error if we do not pass an email', async () => {
        const { User } = models;
        const data = {
          password: 'Test123#',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);
        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('Email is required');
        expect(errorObj.path).toEqual('email');
      });

      it('should error if we create a new user with an invalid username', async () => {
        const { User } = models;
        const data = {
          email: 'test@example.com',
          password: 'Test123#',
          username: 'u',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);
        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('Username must contain between 3 to 50 characters');
        expect(errorObj.path).toEqual('username');
      });

      it('should error if we create a new user with an invalid first name', async () => {
        const { User } = models;
        const data = {
          email: 'test@example.com',
          password: 'Test123#',
          username: 'testuser',
          firstName: 'T',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);
        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('First name must contain between 3 to 50 characters');
        expect(errorObj.path).toEqual('firstName');
      });

      it('should error if we create a new user with an invalid last name', async () => {
        const { User } = models;
        const data = {
          email: 'test@example.com',
          password: 'Test123#',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'u',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);
        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('Last name must contain between 3 to 50 characters');
        expect(errorObj.path).toEqual('lastName');
      });
    });
  });

  describe('scopes', () => {
    let user;

    beforeEach(async () => {
      user = await TestHelpers.createNewUser();
    });

    describe('defaultScope', () => {
      it('should return a user without a password', async () => {
        const { User } = models;
        const userFound = await User.findByPk(user.id);
        expect(userFound.password).toBeUndefined();
      });
    });

    describe('withPassword', () => {
      it('should return a user with the password', async () => {
        const { User } = models;
        const userFound = await User.scope('withPassword').findByPk(user.id);
        expect(userFound.password).toEqual(expect.any(String));
      });
    });
    });

    describe('instance methods', () => {
      describe('comparePasswords', () => {
        let password = 'Test12345#';
        let user;

        beforeEach(async () => {
          user = await TestHelpers.createNewUser({ password });
        });

        it('should return true if the password is correct', async () => {
          const { User } = models;
          const userFound = await User.scope('withPassword').findByPk(user.id);
          const isPasswordCorrect = await userFound.comparePasswords(password);
          expect(isPasswordCorrect).toEqual(true);
        });

        it('should return false if the password is incorrect', async () => {
          const { User } = models;
          const userFound = await User.scope('withPassword').findByPk(user.id);
          const isPasswordCorrect = await userFound.comparePasswords(
            'invalidpassword'
          );
          expect(isPasswordCorrect).toEqual(false);
        });
      });
    });

    describe('hooks', () => {
      it('should not attempt to hash the password if it is not given', async () => {
        const user = await TestHelpers.createNewUser();
        user.email = 'test2@example.com';
        await user.save();
      });
  });
});
