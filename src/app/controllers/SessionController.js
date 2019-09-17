import jwt from 'jsonwebtoken';

import * as Yup from 'yup';
import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    // Procura por um usuário através do seu e-mail
    const user = await User.findOne({ where: { email } });

    // Verifica se esse usuário nao existe
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Se chegou aqui o usuário existe, porém temos que verificar a senha
    if (!(await user.chekckPassword(password))) {
      return res.status(401).json({ error: 'Password does not found' });
    }

    // Se chegou aqui o email e senha foram encontrados
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
