"use strict";

const express = require(`express`);
const request = require(`supertest`);

const offerComment = require(`./offer-comment`);
const comment = require(`./comment`);
const OfferDataService = require(`../data-service/offer`);
const CommentByOfferDataService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `FU-wNh`,
    title: `Куплю породистого кота.`,
    picture: `item11.jpg`,
    description: `Таких предложений больше нет! Даю недельную гарантию. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    type: `offer`,
    sum: 3651,
    category: `Животные`,
    comments: [
      {id: `1S1vJK`, text: `Продаю в связи с переездом. Отрываю от сердца. А где блок питания?`},
      {
        id: `aiehVt`,
        text: `Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    id: `tf0dvo`,
    title: `Продам книги Стивена Кинга.`,
    picture: `item13.jpg`,
    description: `Товар в отличном состоянии. Две страницы заляпаны свежим кофе. Даю недельную гарантию. Это настоящая находка для коллекционера!`,
    type: `sale`,
    sum: 76956,
    category: `Посуда`,
    comments: [
      {
        id: `kUiCYG`,
        text: `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      },
      {id: `3eY69V`, text: `А где блок питания?`},
      {
        id: `c25F0T`,
        text: `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    id: `UEdDE0`,
    title: `Отдам в хорошие руки подшивку «Мурзилка».`,
    picture: `item13.jpg`,
    description: `При покупке с меня бесплатная доставка в черте города. Кажется что это хрупкая вещь. Это настоящая находка для коллекционера! Если товар не понравится — верну всё до последней копейки.`,
    type: `offer`,
    sum: 75276,
    category: `Игры`,
    comments: [
      {id: `g9dL1b`, text: `А где блок питания?`},
      {id: `krzid4`, text: `С чем связана продажа? Почему так дешёво?`},
      {id: `wM2sxP`, text: `Почему в таком ужасном состоянии? Неплохо, но дорого.`}
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  const commentServiceData = new CommentByOfferDataService(cloneData);
  app.use(express.json());
  offerComment(app, new OfferDataService(cloneData), commentServiceData);
  comment(app, commentServiceData);
  return app;
};

describe(`API returbs a list of all comments by offer id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/UEdDE0/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 3 comments by offer id`, () => expect(response.body.length).toBe(3));

  test(`All Comments`, () =>
    request(app)
      .get(`/comments`)
      .expect((res) => expect(res.body.length).toBe(8)));

  test(`First comments's id equals "g9dL1b"`, () => expect(response.body[0].id).toBe(`g9dL1b`));
});

describe(`API creates an comment by offer id`, () => {
  const newComment = {text: `New comment`};
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers/UEdDE0/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () =>
    request(app)
      .get(`/offers/UEdDE0/comments`)
      .expect((res) => expect(res.body.length).toBe(4)));

  test(`All Comments count is changed`, () =>
    request(app)
      .get(`/comments`)
      .expect((res) => expect(res.body.length).toBe(9)));
});

describe(`API correctly deletes an comment by offer id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/UEdDE0/comments/g9dL1b`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted comment`, () => expect(response.body.id).toBe(`g9dL1b`));

  test(`Commet by offer id count is 2 now`, () =>
    request(app)
      .get(`/offers/UEdDE0/comments`)
      .expect((res) => expect(res.body.length).toBe(2)));

  test(`comment by offer id count is 7 now`, () =>
    request(app)
      .get(`/comments`)
      .expect((res) => expect(res.body.length).toBe(7)));
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({text: `Неважно`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app).delete(`/offers/tf0dvo/comments/NOEXST`).expect(HttpCode.NOT_FOUND);
});
