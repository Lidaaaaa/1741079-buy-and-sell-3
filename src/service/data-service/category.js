"use strict";

class CategoryService {
  constructor(offers) {
    this._categories = offers.reduce((acc, offer) => {
      acc.add(offer.category);
      return acc;
    }, new Set());
  }

  findAll() {
    return [...this._categories];
  }
}

module.exports = CategoryService;
