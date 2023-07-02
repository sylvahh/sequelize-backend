import { Router } from 'express';
import models from '../../models';
import requiresAuth from '../../middlewares/requiresAuth';
import asyncWrapper from '../../utils/asyncWrapper';

const router = Router();
const { User, RefreshToken } = models;

router.post('/logout', requiresAuth(),asyncWrapper(async (req, res, next) => {
  const {
    jwt: { email },
  } = req.body;
  const user = await User.findOne({
    where: { email },
    include: RefreshToken,
  });

  user.RefreshToken.token = null;
  await user.RefreshToken.save();
  return res
    .status(200)
    .send({ success: true, message: 'Succesfully logged out' });
})) ;
export default router;
