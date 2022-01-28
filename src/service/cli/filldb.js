"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const {DEFAULT_COUNT, ExitCode} = require(`../../constants`);
const {OfferType, GenerateParams, DataFiles} = require(`./constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const logger = getLogger();

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(...items.splice(getRandomInt(0, items.length), 1));
  }
  return result;
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateComments = (count, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)
    }));

const generateOffers = (count, titles, sentences, categories, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      picture: getPictureFileName(
          getRandomInt(GenerateParams.MIN_PICTURE, GenerateParams.MAX_PICTURE)
      ),
      description: shuffle(sentences).slice(1, 5).join(` `),
      type: OfferType[
        Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]
      ],
      sum: getRandomInt(GenerateParams.MIN_SUM, GenerateParams.MAX_SUM),
      categories: getRandomSubarray(categories),
      comments: generateComments(getRandomInt(1, GenerateParams.MAX_COMMENTS), comments)
    }));

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (e) {
      logger.error(`An error occurred: ${e.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const [titles, sentences, categories, comments] = await Promise.all(
        Object.values(DataFiles).map((item) => readContent(item))
    );

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const offers = generateOffers(countOffer, titles, sentences, categories, comments);

    return initDatabase(sequelize, {offers, categories});
  }
};
