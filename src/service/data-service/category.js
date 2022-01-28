"use strict";

const {Sequelize} = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._category = sequelize.models.Category;
    this._offerCategory = sequelize.models.OfferCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._category.findAll({
        attributes: [`id`, `name`, [Sequelize.fn(`COUNT`, `*`), `count`]],
        group: [Sequelize.col(`Category.id`)],
        include: [
          {
            model: this._offerCategory,
            as: Alias.OFFERS_CATEGORIES,
            attributes: []
          }
        ]
      });
      return result.map((it) => it.get());
    }

    return await this._category.findAll({raw: true});
  }
}

module.exports = CategoryService;
