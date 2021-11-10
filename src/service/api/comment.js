"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/`, (req, res) => {
    const offers = service.findAll();
    res.status(HttpCode.OK).json(offers);
  });
};
