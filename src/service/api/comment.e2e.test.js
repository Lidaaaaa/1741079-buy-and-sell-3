"use strict";

const express = require(`express`);
const request = require(`supertest`);

const comment = require(`./comment`);
const OfferDataService = require(`../data-service/offer`);
const CommentDataService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `qKneBD`,
    title: `Продам советскую посуду. Почти не разбита.`,
    picture: `item08.jpg`,
    description: `Кажется что это хрупкая вещь. Даю недельную гарантию. Кому нужен этот новый телефон если тут такое... Если найдёте дешевле — сброшу цену.`,
    type: `sale`,
    sum: 52848,
    category: `Посуда`,
    comments: [
      {id: `IB4pq9`, text: `Оплата наличными или перевод на карту?`},
      {
        id: `2GWXi4`,
        text: `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      },
      {
        id: `bZWAPk`,
        text: `С чем связана продажа? Почему так дешёво? А сколько игр в комплекте? А где блок питания?`
      },
      {
        id: `aSkj48`,
        text: `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво? Неплохо, но дорого.`
      }
    ]
  },
  {
    id: `Go2n-l`,
    title: `Продам отличную подборку фильмов на VHS.`,
    picture: `item05.jpg`,
    description: `Таких предложений больше нет! Товар в отличном состоянии. Не пытайтесь торговаться. Цену вещам я знаю. Продаю с болью в сердце...`,
    type: `offer`,
    sum: 83945,
    category: `Посуда`,
    comments: [
      {id: `NLWWmq`, text: `Неплохо, но дорого. А где блок питания?`},
      {id: `n8K4nm`, text: `Почему в таком ужасном состоянии?`}
    ]
  },
  {
    id: `yuPNNb`,
    title: `Продам отличную подборку фильмов на VHS.`,
    picture: `item12.jpg`,
    description: `Даю недельную гарантию. Кажется что это хрупкая вещь. Таких предложений больше нет! Если найдёте дешевле — сброшу цену.`,
    type: `sale`,
    sum: 50717,
    category: `Животные`,
    comments: [{id: `7OuDfW`, text: `Продаю в связи с переездом. Отрываю от сердца.`}]
  }
];

const app = express();
app.use(express.json());

comment(app, new OfferDataService(mockData), new CommentDataService(mockData));

describe(`API returns all comments`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});
