"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const userValidator = require(`../middlewares/user-validator`);
const passwordUtils = require(`../lib/password`);

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/user`, route);

  route.post(`/`, userValidator(service), async (req, res) => {
    const data = req.body;
    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await service.create(data);

    delete result.passwordHash;

    return res.status(HttpCode.CREATED).json(result);
  });

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;
    const user = await service.findByEmail(email);

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
    }

    const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);

    if (!passwordIsCorrect) {
      return res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
    }

    delete user.passwordHash;

    return res.status(HttpCode.OK).json(user);
  });
};
