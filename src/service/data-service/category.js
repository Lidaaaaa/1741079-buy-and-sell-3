"use strict";

class CategoryService {
  constructor(offers) {
    this._categories = offers.reduce((acc, offer) => {
      offer.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());
  }

  findAll() {
    return [...this._categories];
  }
}

module.exports = CategoryService;
