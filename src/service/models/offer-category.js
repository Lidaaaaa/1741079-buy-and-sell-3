"use strict";

const {Model} = require(`sequelize`);

class OfferCategory extends Model {}

const define = (sequelize) => OfferCategory.init({}, {sequelize});

module.exports = define;
