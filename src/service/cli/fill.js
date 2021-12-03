"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getRandomInt, shuffle} = require(`../../utils`);
const {Files} = require(`../../constants`);
const {OfferType, GenerateParams, DataFiles} = require(`./constants`);

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateComments = (count, offerId, userCount, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      userId: getRandomInt(1, userCount),
      offerId,
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)
    }));

const generateOffers = (count, titles, categoryCount, userCount, sentences, comments) =>
  Array(count)
    .fill({})
    .map((_, index) => ({
      category: [getRandomInt(1, categoryCount)],
      comments: generateComments(
          getRandomInt(2, GenerateParams.MAX_COMMENTS),
          index + 1,
          userCount,
          comments
      ),
      description: shuffle(sentences).slice(1, 5).join(` `),
      picture: getPictureFileName(
          getRandomInt(GenerateParams.MIN_PICTURE, GenerateParams.MAX_PICTURE)
      ),
      title: titles[getRandomInt(0, titles.length - 1)],
      type: OfferType[
        Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]
      ],
      sum: getRandomInt(GenerateParams.MIN_SUM, GenerateParams.MAX_SUM),
      userId: getRandomInt(1, userCount)
    }));

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || GenerateParams.DEFAULT_COUNT;

    const [titles, sentences, categories, commentSentences] = await Promise.all(
        Object.values(DataFiles).map((item) => readContent(item))
    );

    const offers = generateOffers(
        countOffer,
        titles,
        categories.length,
        users.length,
        sentences,
        commentSentences
    );

    const comments = offers.flatMap((offer) => offer.comments);

    const offerCategories = offers.map((offer, index) => ({
      offerId: index + 1,
      categoryId: offer.category[0]
    }));

    const userValues = users
      .map(
          ({email, passwordHash, firstName, lastName, avatar}) =>
            `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
      )
      .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const offerValues = offers
      .map(
          ({title, description, type, sum, picture, userId}) =>
            `('${title}', '${description}', '${type}', '${sum}', '${picture}', ${userId})`
      )
      .join(`,\n`);

    const offerCategoryValues = offerCategories
      .map(({offerId, categoryId}) => `(${offerId}, ${categoryId})`)
      .join(`,\n`);

    const commentValues = comments
      .map(({text, userId, offerId}) => `('${text}', ${userId}, ${offerId})`)
      .join(`,\n`);

    const content = `
INSERT INTO users(email, password_hash, firstname, lastname, avatar) VALUES
${userValues};

INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE offers DISABLE TRIGGER ALL;

INSERT INTO offers(title, description, type, sum, picture, user_id) VALUES
${offerValues};
ALTER TABLE offers ENABLE TRIGGER ALL;

ALTER TABLE offers_categories DISABLE TRIGGER ALL;
INSERT INTO offers_categories(offer_id, category_id) VALUES
${offerCategoryValues};
ALTER TABLE offers_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(Files.FILL_DB, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
