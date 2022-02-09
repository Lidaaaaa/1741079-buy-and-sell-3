"use strict";
const passwordUtils = require(`../lib/password`);

const mockCategories = [`Посуда`, `Книги`, `Разное`];

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const mockOffers = [
  {
    title: `Куплю антиквариат.`,
    picture: `item08.jpg`,
    description: `Даю недельную гарантию. Кому нужен этот новый телефон если тут такое... Это настоящая находка для коллекционера! Если найдёте дешевле — сброшу цену.`,
    type: `sale`,
    sum: 76125,
    categories: [`Посуда`, `Книги`],
    user: `ivanov@example.com`,
    comments: [
      {
        user: `petrov@example.com`,
        text: `Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      },
      {
        user: `ivanov@example.com`,
        text: `Почему в таком ужасном состоянии? Совсем немного... Вы что?! В магазине дешевле.`
      },
      {
        user: `ivanov@example.com`,
        text: `Совсем немного...`
      },
      {
        user: `petrov@example.com`,
        text: `Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`
      }
    ]
  }
];

module.exports = {mockCategories, mockOffers, mockUsers};
