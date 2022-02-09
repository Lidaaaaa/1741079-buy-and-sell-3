"use strict";

const express = require(`express`);
const request = require(`supertest`);
const {Sequelize} = require(`sequelize`);

const offerComment = require(`./offer-comment`);
const comment = require(`./comment`);
const OfferDataService = require(`../data-service/offer`);
const CommentByOfferDataService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const {mockCategories, mockOffers, mockUsers} = require(`./mocks`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers});
  const app = express();
  app.use(express.json());
  const commentServiceData = new CommentByOfferDataService(mockDB);
  offerComment(app, new OfferDataService(mockDB), commentServiceData);
  comment(app, commentServiceData);
  return app;
};

describe(`API returns a list of all comments by offer id`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/offers/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 4 comments by offer id`, () => expect(response.body.length).toBe(4));

  test(`All Comments`, () =>
    request(app)
      .get(`/comments`)
      .expect((res) => expect(res.body.length).toBe(4)));

  test(`First comments's text equals "Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?"`, () =>
    expect(response.body[0].text).toBe(
        `Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
    ));
});

// describe(`API creates an comment by offer id`, () => {
//   const newComment = {
//     text: `Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.`
//   };
//   let app;
//   let response;

//   beforeAll(async () => {
//     app = await createAPI();
//     response = await request(app).post(`/offers/1/comments`).send(newComment);
//   });

//   test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

//   test(`Comments count is changed`, () =>
//     request(app)
//       .get(`/offers/1/comments`)
//       .expect((res) => expect(res.body.length).toBe(5)));

//   test(`All Comments count is changed`, () =>
//     request(app)
//       .get(`/comments`)
//       .expect((res) => expect(res.body.length).toBe(5)));
// });

describe(`API correctly deletes an comment by offer id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/offers/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Commet by offer id count is 3 now`, () =>
    request(app)
      .get(`/offers/1/comments`)
      .expect((res) => expect(res.body.length).toBe(3)));

  test(`comment by offer id count is 3 now`, () =>
    request(app)
      .get(`/comments`)
      .expect((res) => expect(res.body.length).toBe(3)));
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/offers/20/comments`)
    .send({text: `Неважно`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app).delete(`/offers/1/comments/20`).expect(HttpCode.NOT_FOUND);
});
