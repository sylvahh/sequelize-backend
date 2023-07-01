import { Router } from 'express';
import models from '../../models';
import JWTUtils from '../../utils/jwt-utils';
import requiresAuth from '../../middlewares/requiresAuth';

const router = Router();
const { User, RefreshToken } = models;

router.post('/token', requiresAuth('refreshToken'), async (req, res, next) => {
  const {
    jwt: { email },
  } = req.body;
  const user = await User.findOne({
    where: { email },
    include: RefreshToken,
  });
  const savedToken = user.RefreshToken;

    try {
        if (!savedToken || !savedToken.token) {
            return res.status(401).send({ success: false, message: 'You must log in first' });
          }
        
          const payload = { email };
          const newAccessToken = JWTUtils.generateAccessToken(payload);
        
          return res.status(200).send({ success: true, data: { accessToken: newAccessToken } });
    } catch (error) {
        next(error)
    }
  
});

export default router;
