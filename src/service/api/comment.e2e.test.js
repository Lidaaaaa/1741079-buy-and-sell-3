"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const comment = require(`./comment`);
const OfferDataService = require(`../data-service/offer`);
const CommentDataService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);

const mockCategories = [`Животные`, `Посуда`, `Марки`, `Разное`, `Книги`];

const mockOffers = [
  {
    title: `Продам советскую посуду. Почти не разбита.`,
    picture: `item08.jpg`,
    description: `Кажется что это хрупкая вещь. Даю недельную гарантию. Кому нужен этот новый телефон если тут такое... Если найдёте дешевле — сброшу цену.`,
    type: `sale`,
    sum: 52848,
    categories: [`Животные`, `Посуда`],
    comments: [
      {text: `Оплата наличными или перевод на карту?`},
      {
        text: `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      },
      {
        text: `С чем связана продажа? Почему так дешёво? А сколько игр в комплекте? А где блок питания?`
      },
      {
        text: `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво? Неплохо, но дорого.`
      }
    ]
  },
  {
    title: `Продам отличную подборку фильмов на VHS.`,
    picture: `item05.jpg`,
    description: `Таких предложений больше нет! Товар в отличном состоянии. Не пытайтесь торговаться. Цену вещам я знаю. Продаю с болью в сердце...`,
    type: `offer`,
    sum: 83945,
    categories: [`Марки`, `Посуда`],
    comments: [
      {text: `Неплохо, но дорого. А где блок питания?`},
      {text: `Почему в таком ужасном состоянии?`}
    ]
  },
  {
    title: `Продам отличную подборку фильмов на VHS.`,
    picture: `item12.jpg`,
    description: `Даю недельную гарантию. Кажется что это хрупкая вещь. Таких предложений больше нет! Если найдёте дешевле — сброшу цену.`,
    type: `sale`,
    sum: 50717,
    categories: [`Книги`, `Животные`],
    comments: [{text: `Продаю в связи с переездом. Отрываю от сердца.`}]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  comment(app, new OfferDataService(mockDB), new CommentDataService(mockDB));
});

describe(`API returns all comments`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});
