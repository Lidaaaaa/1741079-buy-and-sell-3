"use strict";

const {Op} = require(`sequelize`);
const Alias = require(`../models/alias`);

class SearchService {
  constructor(sequelize) {
    this._offer = sequelize.models.Offer;
    this._user = sequelize.models.User;
  }

  async findAll(searchText) {
    const offers = await this._offer.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [
        Alias.CATEGORIES,
        {
          model: this._user,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [[`createdAt`, `DESC`]]
    });

    return offers.map((offer) => offer.get());
  }
}

module.exports = SearchService;
