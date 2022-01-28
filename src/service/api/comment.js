"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/`, async (_req, res) => {
    const comments = await service.findAll();
    res.status(HttpCode.OK).json(comments);
  });
};
