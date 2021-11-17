"use strict";

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `AusDhG`,
    title: `Продам коллекцию журналов «Огонёк».`,
    picture: `item04.jpg`,
    description: `Продаю с болью в сердце... Если товар не понравится — верну всё до последней копейки. Кому нужен этот новый телефон если тут такое... Если найдёте дешевле — сброшу цену.`,
    type: `offer`,
    sum: 76453,
    category: `Книги`,
    comments: [
      {
        id: `nGE90J`,
        text: `С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {id: `pD9cEw`, text: `Оплата наличными или перевод на карту?`},
      {id: `l_zZ76`, text: `А сколько игр в комплекте?`}
    ]
  }
];

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({query: `Продам коллекцию журналов`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`1 offer found`, () => expect(response.body.length).toBe(1));

  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`AusDhG`));
});

test(`API returns code 404 if nothing is found`, () =>
  request(app).get(`/search`).query({query: `Продам свою душу`}).expect(HttpCode.NOT_FOUND));

test(`API returns 400 when query string is absent`, () =>
  request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));
