"use strict";

const {Router} = require(`express`);

const category = require(`./category`);
const comment = require(`./comment`);
const offer = require(`./offer`);
const search = require(`./search`);
const offerComment = require(`./offer-comment`);

const getMockData = require(`../lib/get-mock-data`);

const {CategoryService, OfferService, CommentService, SearchService} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();
  const commentService = new CommentService(mockData);
  const offerService = new OfferService(mockData);

  category(app, new CategoryService(mockData));
  comment(app, commentService);
  offer(app, offerService);
  offerComment(app, offerService, commentService);
  search(app, new SearchService(mockData));
})();

module.exports = app;
