import Jwt from 'jsonwebtoken';
import environments from '../config/environments';

export default class JWTUtils {
  static generateAccessToken(payload, options = {}) {
    const { expiresIn = '1d' } = options;
    return Jwt.sign(payload, environments.jwtAccessTokenSecret, { expiresIn });
  }
  static generateRefreshToken(payload) {
    return Jwt.sign(payload, environments.jwtRefreshTokenSecret);
  }

  static verifyAccessToken(accessToken) {
    return Jwt.verify(accessToken, environments.jwtAccessTokenSecret);
  }

  static verifyRefreshToken(refreshToken) {
    return Jwt.verify(refreshToken, environments.jwtRefreshTokenSecret);
  }
}
