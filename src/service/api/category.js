"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, categoryService) => {
  const route = new Router();

  app.use(`/category`, route);

  route.get(`/`, (req, res) => {
    const offers = categoryService.findAll();
    res.status(HttpCode.OK).json(offers);
  });
};
