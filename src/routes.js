import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store); // Rota de criação de um usuário
routes.put('/users', UserController.update); // Rota de update de um usuário
routes.post('/sessions', SessionController.store); // Rota de Autenticação de usuário

routes.use(authMiddleware); // Middleware Global

routes.post('/files', upload.single('file'), FileController.store); // Rota de add um arquivo para avatar

export default routes;
