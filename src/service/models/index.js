"use strict";

const Alias = require(`./alias`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);
const defineOfferCategory = require(`./offer-category`);
const defineUser = require(`./user`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const OfferCategory = defineOfferCategory(sequelize);
  const User = defineUser(sequelize);

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

  User.hasMany(Offer, {
    as: Alias.OFFERS,
    foreignKey: `userId`
  });

  Offer.belongsTo(User, {
    as: Alias.USERS,
    foreignKey: `userId`
  });

  User.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `userId`
  });

  Comment.belongsTo(User, {
    as: Alias.USERS,
    foreignKey: `userId`
  });

  return {Category, Comment, Offer, OfferCategory, User};
};

module.exports = define;
