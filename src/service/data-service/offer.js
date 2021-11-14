"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer) {
    const newOffer = Object.assign({id: nanoid(MAX_ID_LENGTH), comments: []}, offer);
    this._offers.push(newOffer);
    return newOffer;
  }

  drop(offer) {
    this._offers = this._offers.filter((item) => item.id !== offer.id);
    return offer;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._offers.find((item) => item.id === id);
  }

  update(prevOffer, offer) {
    return Object.assign(prevOffer, offer);
  }
}

module.exports = OfferService;
