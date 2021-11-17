"use strict";

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const category = require(`./category`);
const OfferDataService = require(`../data-service/offer`);
const CategoryDataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `0izuga`,
    title: `Куплю антиквариат.`,
    picture: `item08.jpg`,
    description: `Даю недельную гарантию. Кому нужен этот новый телефон если тут такое... Это настоящая находка для коллекционера! Если найдёте дешевле — сброшу цену.`,
    type: `sale`,
    sum: 76125,
    category: `Посуда`,
    comments: [
      {
        id: `g4YHHK`,
        text: `Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      },
      {
        id: `-5dToS`,
        text: `Почему в таком ужасном состоянии? Совсем немного... Вы что?! В магазине дешевле.`
      },
      {id: `x2vnMc`, text: `Совсем немного...`},
      {
        id: `yVp7m2`,
        text: `Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    id: `BYZ_S8`,
    title: `Продам отличную подборку фильмов на VHS.`,
    picture: `item10.jpg`,
    description: `Мой дед не мог её сломать. Товар в отличном состоянии. При покупке с меня бесплатная доставка в черте города. Кажется что это хрупкая вещь.`,
    type: `sale`,
    sum: 76908,
    category: `Игры`,
    comments: [
      {id: `-RXryT`, text: `Совсем немного... Вы что?! В магазине дешевле.`},
      {id: `GTnLoU`, text: `А сколько игр в комплекте?`},
      {
        id: `PfMnvf`,
        text: `Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      }
    ]
  },
  {
    id: `-RIZJF`,
    title: `Продам коллекцию журналов «Огонёк».`,
    picture: `item16.jpg`,
    description: `Две страницы заляпаны свежим кофе. Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии. Бонусом отдам все аксессуары.`,
    type: `sale`,
    sum: 61216,
    category: `Журналы`,
    comments: [
      {id: `fqidxN`, text: `А где блок питания? А сколько игр в комплекте?`},
      {id: `GE7FI-`, text: `Совсем немного...`}
    ]
  },
  {
    id: `aU-dss`,
    title: `Отдам в хорошие руки подшивку «Мурзилка».`,
    picture: `item07.jpg`,
    description: `Не пытайтесь торговаться. Цену вещам я знаю. Если найдёте дешевле — сброшу цену. Даю недельную гарантию. Это настоящая находка для коллекционера!`,
    type: `sale`,
    sum: 79342,
    category: `Разное`,
    comments: [
      {id: `b6AIh3`, text: `А где блок питания?`},
      {
        id: `iGv-A-`,
        text: `Совсем немного... Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво?`
      },
      {
        id: `5w2GAJ`,
        text: `А сколько игр в комплекте? Почему в таком ужасном состоянии? Неплохо, но дорого.`
      },
      {id: `hCVtvu`, text: `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`}
    ]
  },
  {
    id: `u-86jA`,
    title: `Продам коллекцию журналов «Огонёк».`,
    picture: `item13.jpg`,
    description: `Продаю с болью в сердце... Две страницы заляпаны свежим кофе. Кому нужен этот новый телефон если тут такое... Не пытайтесь торговаться. Цену вещам я знаю.`,
    type: `sale`,
    sum: 52971,
    category: `Разное`,
    comments: [
      {
        id: `qkKYfb`,
        text: `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого.`
      },
      {
        id: `AoTtPA`,
        text: `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Совсем немного...`
      },
      {
        id: `gva486`,
        text: `Почему в таком ужасном состоянии? Оплата наличными или перевод на карту?`
      },
      {id: `eEA7K2`, text: `Оплата наличными или перевод на карту?`}
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offer(app, new OfferDataService(cloneData));
  category(app, new CategoryDataService(cloneData));
  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));

  test(`First offer's id equals "0izuga"`, () => expect(response.body[0].id).toBe(`0izuga`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/0izuga`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Куплю антиквариат."`, () =>
    expect(response.body.title).toBe(`Куплю антиквариат.`));

  test(`Status code 400`, () =>
    request(app)
      .get(`/offers/5w2GAJ`)
      .expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND)));

  test(`Category count is 4 now`, () =>
    request(app)
      .get(`/categories`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns offer created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offers count is changed`, () =>
    request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(6)));

  test(`Category count is 5 now`, () =>
    request(app)
      .get(`/categories`)
      .expect((res) => expect(res.body.length).toBe(5)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app).post(`/offers`).send(badOffer).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API chages existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).put(`/offers/0izuga`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns chaged offer`, () =>
    expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offer is really changed`, () =>
    request(app)
      .get(`/offers/0izuga`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`)));
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const app = createAPI();

  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };
  return request(app).put(`/oofers/NOEXST`).send(validOffer).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
  const app = createAPI();

  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app).put(`/offers/NOEXST`).send(invalidOffer).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/u-86jA`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`u-86jA`));

  test(`Offer count is 4 now`, () =>
    request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(4)));

  test(`Category count is 4 now`, () =>
    request(app)
      .get(`/categories`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app).delete(`/offers/NOEXST`).expect(HttpCode.NOT_FOUND);
});
