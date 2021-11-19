"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const mainRouter = new Router();

const api = getAPI();

mainRouter.get(`/`, async (_req, res) => {
  const offers = await api.getOffers();
  res.render(`main/main`, {offers});
});

mainRouter.get(`/register`, (_req, res) => res.render(`main/sign-up`));

mainRouter.get(`/login`, (_req, res) => res.render(`main/login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {query} = req.query;
    const results = await api.search(query);
    res.render(`main/search-result`, {results});
  } catch (e) {
    res.render(`main/search-result`, {results: []});
  }
});

module.exports = mainRouter;
