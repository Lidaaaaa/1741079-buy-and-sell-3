"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, async (_req, res) => {
  const offers = await api.getOffers();
  res.render(`my/my-tickets`, {offers});
});

myRouter.get(`/comments`, async (_req, res) => {
  const offers = await api.getOffers({comments: true});
  res.render(`my/comments`, {offers: offers.slice(0, 5)});
});

module.exports = myRouter;
