"use strict";

const Alias = require(`./alias`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);
const defineOfferCategory = require(`./offer-category`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const OfferCategory = defineOfferCategory(sequelize);

  Offer.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `offerId`,
    onDelete: `cascade`
  });

  Comment.belongsTo(Offer, {
    foreignKey: `offerId`
  });

  Offer.belongsToMany(Category, {
    through: OfferCategory,
    as: Alias.CATEGORIES
  });

  Category.belongsToMany(Offer, {
    through: OfferCategory,
    as: Alias.OFFERS
  });

  Category.hasMany(OfferCategory, {
    as: Alias.OFFERS_CATEGORIES
  });

  return {Category, Comment, Offer, OfferCategory};
};

module.exports = define;
