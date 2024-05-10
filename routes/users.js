import { Router } from 'express';
import userController from '../controllers/user.js';
import token from '../utils/index.js';
import middleware from '../middlewares/index.js';
const UserRouter = Router();
UserRouter.get('/users', userController.getAllUser);
UserRouter.post('/create', userController.create);
UserRouter.post('/login', userController.login);
UserRouter.get('/profile/:id', middleware.verifyJwt, userController.profile)
UserRouter.put('/profile/:id', middleware.verifyJwt, userController.editProfile)
UserRouter.post('/logout', middleware.verifyJwt, userController.logout)
UserRouter.post('/reset-password', middleware.verifyJwt, userController.resetPassword);
UserRouter.get('/forgot-password', userController.forgotPassword);

export default UserRouter;