"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const comment = require(`./comment`);
const OfferDataService = require(`../data-service/offer`);
const CommentDataService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const {mockCategories, mockOffers, mockUsers} = require(`./mocks`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers});
  comment(app, new OfferDataService(mockDB), new CommentDataService(mockDB));
});

describe(`API returns all comments`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});
