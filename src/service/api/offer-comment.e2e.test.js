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

const mockCategories = [`Животные`, `Посуда`, `Игры`, `Марки`, `Разное`, `Книги`];

const mockOffers = [
  {
    title: `Куплю породистого кота.`,
    picture: `item11.jpg`,
    description: `Таких предложений больше нет! Даю недельную гарантию. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    type: `offer`,
    sum: 3651,
    categories: [`Животные`, `Посуда`],
    comments: [
      {text: `Продаю в связи с переездом. Отрываю от сердца. А где блок питания?`},
      {
        text: `Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    title: `Продам книги Стивена Кинга.`,
    picture: `item13.jpg`,
    description: `Товар в отличном состоянии. Две страницы заляпаны свежим кофе. Даю недельную гарантию. Это настоящая находка для коллекционера!`,
    type: `sale`,
    sum: 76956,
    categories: [`Посуда`, `Марки`, `Разное`],
    comments: [
      {
        text: `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      },
      {text: `А где блок питания?`},
      {
        text: `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    title: `Отдам в хорошие руки подшивку «Мурзилка».`,
    picture: `item13.jpg`,
    description: `При покупке с меня бесплатная доставка в черте города. Кажется что это хрупкая вещь. Это настоящая находка для коллекционера! Если товар не понравится — верну всё до последней копейки.`,
    type: `offer`,
    sum: 75276,
    categories: [`Игры`, `Посуда`],
    comments: [
      {text: `А где блок питания?`},
      {text: `С чем связана продажа? Почему так дешёво?`},
      {text: `Почему в таком ужасном состоянии? Неплохо, но дорого.`}
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
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

  test(`Returns a list of 3 comments by offer id`, () => expect(response.body.length).toBe(2));

  test(`All Comments`, () =>
    request(app)
      .get(`/comments`)
      .expect((res) => expect(res.body.length).toBe(8)));

  test(`First comments's text equals "Продаю в связи с переездом. Отрываю от сердца. А где блок питания?"`, () =>
    expect(response.body[0].text).toBe(
        `Продаю в связи с переездом. Отрываю от сердца. А где блок питания?`
    ));
});

// describe(`API creates an comment by offer id`, () => {
//   const newComment = {text: `New comment`};
//   let app;
//   let response;

//   beforeAll(async () => {
//     app = await createAPI();
//     response = await request(app).post(`/offers/3/comments`).send(newComment);
//   });

//   test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

//   test(`Comments count is changed`, () =>
//     request(app)
//       .get(`/offers/3/comments`)
//       .expect((res) => expect(res.body.length).toBe(4)));

//   test(`All Comments count is changed`, () =>
//     request(app)
//       .get(`/comments`)
//       .expect((res) => expect(res.body.length).toBe(9)));
// });

// describe(`API correctly deletes an comment by offer id`, () => {
//   let app;
//   let response;

//   beforeAll(async () => {
//     app = await createAPI();
//     response = await request(app).delete(`/offers/1/comments/1`);
//   });

//   test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

//   test(`Commet by offer id count is 1 now`, () =>
//     request(app)
//       .get(`/offers/1/comments`)
//       .expect((res) => expect(res.body.length).toBe(1)));

//   test(`comment by offer id count is 7 now`, () =>
//     request(app)
//       .get(`/comments`)
//       .expect((res) => expect(res.body.length).toBe(7)));
// });

// test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
//   const app = await createAPI();

//   return request(app)
//     .post(`/offers/20/comments`)
//     .send({text: `Неважно`})
//     .expect(HttpCode.NOT_FOUND);
// });

// test(`API refuses to delete non-existent comment`, async () => {
//   const app = await createAPI();

//   return request(app).delete(`/offers/1/comments/20`).expect(HttpCode.NOT_FOUND);
// });
