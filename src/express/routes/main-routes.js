"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const mainRouter = new Router();

const api = getAPI();

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [{count, offers}, categories] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true)
  ]);

  const totalPage = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`main/main`, {offers, categories, totalPage, page});
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
