import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    /* Eles esta verficando se existe um user.password, ou seja,
    estamos passando uma senha.. e
    stamos pegando o campo password_hash, e usando o método brypt.hash,
     que faz o hash, do campo passado como parâmetro que no caso é user.passaword.
     O numero 8 é o numero da força da criptografia. */
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // Funcção que verifica se ja existe senha no banco
  chekckPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
