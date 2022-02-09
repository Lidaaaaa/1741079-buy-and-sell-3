"use strict";

const Alias = require(`../models/alias`);

class OfferService {
  constructor(sequelize) {
    this._offer = sequelize.models.Offer;
    this._comment = sequelize.models.Comment;
    this._category = sequelize.models.Category;
    this._user = sequelize.models.User;
  }

  async create(data) {
    const offer = await this._offer.create(data);
    await offer.addCategories(data.categories);
    return offer.get();
  }

  async drop(id) {
    const deletedOffer = await this._offer.destroy({
      where: {id}
    });

    return !!deletedOffer;
  }

  async findAll(needComments) {
    const userModel = {
      model: this._user,
      as: Alias.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    };

    const include = [Alias.CATEGORIES, userModel];

    if (needComments) {
      include.push({
        model: this._comment,
        as: Alias.COMMENTS,
        include: [userModel]
      });
    }

    const offers = await this._offer.findAll({
      include,
      order: [[`createdAt`, `DESC`]]
    });

    return offers.map((item) => item.get());
  }

  async findOne(id, needComments) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push(Alias.COMMENTS);
    }

    return await this._offer.findByPk(id, {include});
  }

  async update(id, offer) {
    const [affectedRows] = await this._offer.update(offer, {
      where: {id}
    });

    return !!affectedRows;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._offer.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES],
      order: [[`createdAt`, `DESC`]],
      distinct: true
    });

    return {count, offers: rows};
  }
}

module.exports = OfferService;
