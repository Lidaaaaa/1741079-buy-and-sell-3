"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const offersRouter = new Router();
const api = getAPI();

offersRouter.get(`/`, async (_req, res) => {
  const offers = await api.getOffers();
  res.render(`my/my-tickets`, {offers});
});

offersRouter.get(`/comments`, async (_req, res) => {
  const offers = await api.getOffers();
  res.render(`my/comments`, {offers: offers.slice(0, 5)});
});

module.exports = offersRouter;
