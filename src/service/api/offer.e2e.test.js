"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const {mockCategories, mockOffers, mockUsers} = require(`./mocks`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const app = express();
  app.use(express.json());
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers});
  offer(app, new DataService(mockDB));
  return app;
};

describe(`API returns a list of all offers`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(1));

  test(`First offer's title equals "Куплю антиквариат."`, () =>
    expect(response.body[0].title).toBe(`Куплю антиквариат.`));
});

describe(`API returns an offer with given id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Куплю антиквариат."`, () =>
    expect(response.body.title).toBe(`Куплю антиквариат.`));

  test(`Status code 400`, () =>
    request(app)
      .get(`/offers/20`)
      .expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND)));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    categories: [2],
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф. Сто процентный результат!`,
    picture: `cat.jpg`,
    type: `offer`,
    sum: 100500
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Offers count is changed`, () =>
    request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(2)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    categories: [1, 2],
    title: `Дам погладить котика`,
    description: `Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.`,
    picture: `cat.jpg`,
    type: `offer`,
    sum: 100500
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badOffers = [
      {...newOffer, sum: true},
      {...newOffer, picture: 12345},
      {...newOffer, categories: `Котики`}
    ];
    for (const badOffer of badOffers) {
      await request(app).post(`/offers`).send(badOffer).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badOffers = [
      {...newOffer, sum: -1},
      {...newOffer, title: `too short`},
      {...newOffer, categories: []}
    ];
    for (const badOffer of badOffers) {
      await request(app).post(`/offers`).send(badOffer).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    categories: [2],
    title: `Дам погладить котика`,
    description: `Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.`,
    picture: `cat.jpg`,
    type: `offer`,
    sum: 100500
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/offers/1`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer is really changed`, () =>
    request(app)
      .get(`/offers/1`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`)));
});

test(`API returns status code 404 when trying to change non-existent offer`, async () => {
  let app = await createAPI();

  const validOffer = {
    categories: [1],
    title: `валидный`,
    description: `Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.`,
    picture: `объявления.jpg`,
    type: `однако`,
    sum: 404
  };
  return request(app).put(`/offers/20`).send(validOffer).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
  const app = await createAPI();

  const invalidOffer = {
    categories: [3],
    title: `невалидный`,
    description: `Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.`,
    picture: `объявления.jpg`,
    type: `нет поля sum`
  };

  return request(app).put(`/offers/1`).send(invalidOffer).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer count is 0 now`, () =>
    request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(0)));
});

test(`API refuses to delete non-existent offer`, async () => {
  const app = await createAPI();
  return request(app).delete(`/offers/20`).expect(HttpCode.NOT_FOUND);
});
