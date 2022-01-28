"use strict";

const {Router} = require(`express`);

const category = require(`./category`);
const comment = require(`./comment`);
const offer = require(`./offer`);
const search = require(`./search`);
const offerComment = require(`./offer-comment`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {CategoryService, OfferService, CommentService, SearchService} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(() => {
  const commentService = new CommentService(sequelize);
  const offerService = new OfferService(sequelize);

  category(app, new CategoryService(sequelize));
  comment(app, commentService);
  offer(app, offerService);
  offerComment(app, offerService, commentService);
  search(app, new SearchService(sequelize));
})();

module.exports = app;
