"use strict";

const {Router} = require(`express`);
const {prepareErrors} = require(`../../utils`);
const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);

const mainRouter = new Router();
const api = getAPI();

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [{count, offers}, categories] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true)
  ]);

  const totalPage = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`main/main`, {
    offers,
    categories,
    totalPage,
    page,
    user
  });
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;

  if (user) {
    return res.redirect(`/`);
  }

  return res.render(`main/sign-up`);
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : ``,
    name: body[`user-name`],
    email: body[`user-email`],
    password: body[`user-password`],
    passwordRepeated: body[`user-password-again`]
  };

  try {
    await api.createUser(userData);
    res.render(`main/login`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const {user} = req.session;
    res.render(`main/sign-up`, {
      validationMessages,
      user
    });
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;

  if (user) {
    return res.redirect(`/`);
  }

  return res.render(`main/login`);
});

mainRouter.post(`/login`, async (req, res) => {
  const data = {
    email: req.body[`user-email`],
    password: req.body[`user-password`]
  };

  try {
    const user = await api.auth(data);
    req.session.user = user;
    req.session.save(() => res.redirect(`/`));
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const user = req.session;
    res.render(`login`, {user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;
  try {
    const results = await api.search(query);
    res.render(`main/search-result`, {results, user});
  } catch (e) {
    res.render(`main/search-result`, {results: [], user});
  }
});

module.exports = mainRouter;
