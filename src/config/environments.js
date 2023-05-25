export default {
  port: parseInt(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  saltRounds: process.env.SALT_ROUNDS || 10,
  jwtAccessTokenSecret:
    process.env.JWT_ACCESS_SECRET ||
    '52ac98947f1c37eabe985ff712f4273b355021b2d490935693028df47dc166bc',
  jwtRefreshTokenSecret:
    process.env.JWT_REFRESH_SECRET ||
    '0a1da9fb354f5569d68ff8af9b0338bea931468ecb1e61967a5f04ee750de450',
};
