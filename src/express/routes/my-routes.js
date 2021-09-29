"use strict";

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/`, (req, res) => res.render(`my/my-tickets`));
offersRouter.get(`/comments`, (req, res) => res.render(`my/comments`));

module.exports = offersRouter;
