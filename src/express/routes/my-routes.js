"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const auth = require(`../middlewares/auth`);

const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers();

  res.render(`my/my-tickets`, {offers, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers({comments: true});

  res.render(`my/comments`, {offers: offers.slice(0, 5), user});
});

module.exports = myRouter;
