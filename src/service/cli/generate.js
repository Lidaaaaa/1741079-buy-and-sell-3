"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {Files, MAX_ID_LENGTH, ExitCode} = require(`../../constants`);
const {OfferType, DataFiles, GenerateParams} = require(`./constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

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

const generateComments = (count, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)
    }));

const generateOffers = (count, titles, sentences, categories, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      title: titles[getRandomInt(0, titles.length - 1)],
      picture: getPictureFileName(
          getRandomInt(GenerateParams.MIN_PICTURE, GenerateParams.MAX_PICTURE)
      ),
      description: shuffle(sentences).slice(1, 5).join(` `),
      type: OfferType[
        Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]
      ],
      sum: getRandomInt(GenerateParams.MIN_SUM, GenerateParams.MAX_SUM),
      category: categories[getRandomInt(0, categories.length - 1)],
      comments: generateComments(getRandomInt(1, GenerateParams.MAX_COMMENTS), comments)
    }));

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || GenerateParams.DEFAULT_COUNT;
    const [titles, sentences, categories, comments] = await Promise.all(
        Object.values(DataFiles).map((item) => readContent(item))
    );

    if (countOffer > GenerateParams.MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(
        generateOffers(countOffer, titles, sentences, categories, comments)
    );

    try {
      await fs.writeFile(Files.MOCK_DATA, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
