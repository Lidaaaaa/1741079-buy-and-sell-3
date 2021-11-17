"use strict";

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`./../data-service/category`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `DEgFOJ`,
    title: `Продам книги Стивена Кинга.`,
    picture: `item16.jpg`,
    description: `Кажется что это хрупкая вещь. При покупке с меня бесплатная доставка в черте города. Таких предложений больше нет! Пользовались бережно и только по большим праздникам.`,
    type: `offer`,
    sum: 28633,
    category: `Животные`,
    comments: [
      {
        id: `4eVK76`,
        text: `Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво? Неплохо, но дорого.`
      },
      {id: `uNACyq`, text: `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`},
      {id: `gmXa6W`, text: `А где блок питания?`},
      {id: `sLsGhU`, text: `Совсем немного...`}
    ]
  },
  {
    id: `_MKUGF`,
    title: `Продам отличную подборку фильмов на VHS.`,
    picture: `item05.jpg`,
    description: `Это настоящая находка для коллекционера! Продаю с болью в сердце... Если товар не понравится — верну всё до последней копейки. Не пытайтесь торговаться. Цену вещам я знаю.`,
    type: `offer`,
    sum: 95329,
    category: `Книги`,
    comments: [
      {
        id: `aomvie`,
        text: `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво? Неплохо, но дорого.`
      }
    ]
  },
  {
    id: `ceDhLz`,
    title: `Отдам в хорошие руки подшивку «Мурзилка».`,
    picture: `item12.jpg`,
    description: `Кому нужен этот новый телефон если тут такое... Мой дед не мог её сломать. Не пытайтесь торговаться. Цену вещам я знаю. Таких предложений больше нет!`,
    type: `offer`,
    sum: 87924,
    category: `Игры`,
    comments: [{id: `_CvHc4`, text: `А сколько игр в комплекте?`}]
  }
];

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));

  test(`Category names are  "Животные","Книги","Игры"`, () =>
    expect(response.body).toEqual(expect.arrayContaining([`Животные`, `Книги`, `Игры`])));
});
