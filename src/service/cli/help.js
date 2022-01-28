"use strict";

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для api.

    Гайд:
      server <command>

      Команды:
      --version:            выводит номер версии
      --help:               печатает этот текст
      --filldb              заполняет базу данных
      --server <port>       запуск сервера
    `;

    console.log(chalk.gray(text));
  }
};
