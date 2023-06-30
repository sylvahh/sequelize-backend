import { Router } from 'express';
import models from '../../models';
import JWTUtils from '../../utils/jwt-utils';

const router = Router();
const { User } = models;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user || !(await user.comparePasswords(password))) {
    res.status(401).send({ success: false, message: 'Invalid credentials' });
  } else {
    const payload = { email };
    const accessToken = JWTUtils.generateAccessToken(payload);
    const savedRefreshToken = await user.getRefreshToken();
    let refreshToken;
    if (!savedRefreshToken || !savedRefreshToken.token) {
      refreshToken = JWTUtils.generateRefreshToken(payload);
      if (!savedRefreshToken) {
        await user.createRefreshToken({ token: refreshToken });
      } else {
        savedRefreshToken.token = refreshToken;
        await savedRefreshToken.save();
      }
    } else {
      refreshToken = savedRefreshToken.token;
    }
    res.status(200).send({
      data: {
        accessToken,
        refreshToken,
      },
    });
  }
});

export default router;
